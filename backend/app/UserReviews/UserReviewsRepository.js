const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository'); // To check user existence and update ratings
const ShipmentContractRepository = require('../ShipmentContracts/ShipmentContractRepository'); // To check contract existence

/**
 * Helper function to update the average rating for a user.
 * This should be called within a transaction when a review is created, updated, or deleted.
 * @param {number} reviewedUserId - The ID of the user whose rating needs to be updated.
 * @param {object} connection - The database connection (for transactions).
 */
async function updateUserAverageRating(reviewedUserId, connection) {
    try {
        const [reviews] = await connection.query(
            'SELECT rating FROM user_reviews WHERE reviewed_user_id = ?',
            [reviewedUserId]
        );

        let averageRating = null;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = parseFloat((totalRating / reviews.length).toFixed(2)); // Keep 2 decimal places
        }

        // Here, we also update trips_completed for simplicity, assuming one review per completed contract.
        // In a more complex system, trips_completed might be updated when a contract status changes to 'completed'.
        const tripsCompleted = reviews.length;

        await connection.query(
            'UPDATE users SET rating = ?, trips_completed = ? WHERE id = ?',
            [averageRating, tripsCompleted, reviewedUserId]
        );
        console.log(`Updated average rating for user ${reviewedUserId} to ${averageRating} and trips to ${tripsCompleted}`);
    } catch (error) {
        console.error(`Error updating average rating for user ${reviewedUserId}:`, error);
        throw error; // Re-throw to be caught by the calling function's transaction handler
    }
}

/**
 * Creates a new user review.
 * POST /api/user-reviews
 */
exports.createUserReview = async (req, res) => {
    const {
        reviewer_user_id, reviewed_user_id, contract_id, rating, comment
    } = req.body;

    // Basic validation
    if (reviewer_user_id === undefined || reviewed_user_id === undefined || contract_id === undefined || rating === undefined) {
        return res.status(400).json({ error: 'Missing required fields: reviewer_user_id, reviewed_user_id, contract_id, rating are required.' });
    }
    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 10) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 10.' });
    }
    if (reviewer_user_id === reviewed_user_id) {
        return res.status(400).json({ error: 'Reviewer and reviewed user cannot be the same.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check foreign key existences
        if (!await UserRepository.checkUserExistsInTransaction(reviewer_user_id, connection)) {
            await connection.rollback();
            return res.status(404).json({ error: `Reviewer user with id ${reviewer_user_id} not found.` });
        }
        if (!await UserRepository.checkUserExistsInTransaction(reviewed_user_id, connection)) {
            await connection.rollback();
            return res.status(404).json({ error: `Reviewed user with id ${reviewed_user_id} not found.` });
        }
        // Assuming ShipmentContractRepository has a checkContractExistsInTransaction or similar
        const [contractExists] = await connection.query('SELECT id FROM shipment_contracts WHERE id = ?', [contract_id]);
        if (contractExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: `Contract with id ${contract_id} not found.` });
        }

        // Check if this reviewer has already reviewed this contract
        const [existingReview] = await connection.query(
            'SELECT id FROM user_reviews WHERE reviewer_user_id = ? AND contract_id = ?',
            [reviewer_user_id, contract_id]
        );
        if (existingReview.length > 0) {
            await connection.rollback();
            return res.status(409).json({ error: 'You have already reviewed this contract.' });
        }

        const reviewData = {
            reviewer_user_id, reviewed_user_id, contract_id, rating, comment
        };

        const [result] = await connection.query('INSERT INTO user_reviews SET ?', reviewData);
        const newReviewId = result.insertId;

        // Update average rating for the reviewed user
        await updateUserAverageRating(reviewed_user_id, connection);

        await connection.commit();

        const [createdReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [newReviewId]); // Fetch outside transaction for simplicity
        res.status(201).json(createdReview[0]);

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Failed to create user review:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'Invalid foreign key. Ensure users and contract exist.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create user review', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Retrieves all user reviews (research function with filters).
 * GET /api/user-reviews
 * Query params: reviewer_user_id, reviewed_user_id, contract_id, min_rating, max_rating
 */
exports.getAllUserReviews = async (req, res) => {
    try {
        let query = `
            SELECT ur.*, 
                   reviewer.name as reviewer_name, 
                   reviewed.name as reviewed_name
            FROM user_reviews ur
            JOIN users reviewer ON ur.reviewer_user_id = reviewer.id
            JOIN users reviewed ON ur.reviewed_user_id = reviewed.id
        `;
        const conditions = [];
        const params = [];

        if (req.query.reviewer_user_id) {
            conditions.push('ur.reviewer_user_id = ?');
            params.push(parseInt(req.query.reviewer_user_id, 10));
        }
        if (req.query.reviewed_user_id) {
            conditions.push('ur.reviewed_user_id = ?');
            params.push(parseInt(req.query.reviewed_user_id, 10));
        }
        if (req.query.contract_id) {
            conditions.push('ur.contract_id = ?');
            params.push(parseInt(req.query.contract_id, 10));
        }
        if (req.query.min_rating) {
            conditions.push('ur.rating >= ?');
            params.push(parseInt(req.query.min_rating, 10));
        }
        if (req.query.max_rating) {
            conditions.push('ur.rating <= ?');
            params.push(parseInt(req.query.max_rating, 10));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        query += ' ORDER BY ur.created_at DESC';

        const [reviews] = await db.query(query, params);
        res.status(200).json(reviews);

    } catch (error) {
        console.error('Failed to retrieve user reviews:', error);
        res.status(500).json({ error: 'Failed to retrieve user reviews', details: error.message });
    }
};

/**
 * Retrieves a single user review by its ID.
 * GET /api/user-reviews/:id
 */
exports.getUserReviewById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const query = `
            SELECT ur.*, 
                   reviewer.name as reviewer_name, 
                   reviewed.name as reviewed_name
            FROM user_reviews ur
            JOIN users reviewer ON ur.reviewer_user_id = reviewer.id
            JOIN users reviewed ON ur.reviewed_user_id = reviewed.id
            WHERE ur.id = ?
        `;
        const [reviews] = await db.query(query, [parsedId]);
        if (reviews.length > 0) {
            res.status(200).json(reviews[0]);
        } else {
            res.status(404).json({ error: 'User review not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve user review:', error);
        res.status(500).json({ error: 'Failed to retrieve user review', details: error.message });
    }
};

/**
 * Updates an existing user review (only rating and comment).
 * PUT /api/user-reviews/:id
 * The user making the request should be ur.reviewer_user_id (auth check needed).
 */
exports.updateUserReview = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const { rating, comment } = req.body;
    const fieldsToUpdate = {};

    if (rating !== undefined) {
        if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 10) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 10.' });
        }
        fieldsToUpdate.rating = rating;
    }
    if (comment !== undefined) { // Allow setting comment to null or empty string
        fieldsToUpdate.comment = comment;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields (rating, comment) to update provided.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [existingReviews] = await connection.query('SELECT reviewer_user_id, reviewed_user_id FROM user_reviews WHERE id = ?', [parsedId]);
        if (existingReviews.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User review not found' });
        }
        const existingReview = existingReviews[0];

        // Authorization: Check if the logged-in user is the one who wrote the review
        // This requires req.user to be populated by an auth middleware
        if (req.user && req.user.userId !== existingReview.reviewer_user_id) {
            await connection.rollback();
            return res.status(403).json({ error: 'Forbidden: You can only update your own reviews.' });
        } else if (!req.user) { // Fallback if auth middleware isn't strictly enforced for some reason
            await connection.rollback();
            return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
        }


        const [result] = await connection.query('UPDATE user_reviews SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            // Update average rating if the rating was changed
            if (fieldsToUpdate.rating !== undefined) {
                await updateUserAverageRating(existingReview.reviewed_user_id, connection);
            }
            await connection.commit();

            const [updatedReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [parsedId]);
            res.status(200).json(updatedReview[0]);
        } else {
            await connection.rollback(); // No rows affected, but review exists (e.g. data was identical)
            const [currentReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [parsedId]);
            res.status(200).json(currentReview[0]); // Return current state
        }
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Failed to update user review:', error);
        res.status(500).json({ error: 'Failed to update user review', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Deletes a user review by its ID.
 * DELETE /api/user-reviews/:id
 * The user making the request should be ur.reviewer_user_id or an admin (auth check needed).
 */
exports.deleteUserReview = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [existingReviews] = await connection.query('SELECT reviewer_user_id, reviewed_user_id FROM user_reviews WHERE id = ?', [parsedId]);
        if (existingReviews.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'User review not found' });
        }
        const existingReview = existingReviews[0];

        // Authorization: Check if the logged-in user is the one who wrote the review or an admin
        // This requires req.user to be populated by an auth middleware
        const isAdmin = req.user && req.user.roles && req.user.roles.includes('admin');
        if (req.user && (req.user.userId === existingReview.reviewer_user_id || isAdmin)) {
            // Authorized
        } else if (!req.user) {
            await connection.rollback();
            return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
        } else {
            await connection.rollback();
            return res.status(403).json({ error: 'Forbidden: You can only delete your own reviews or require admin privileges.' });
        }

        const [result] = await connection.query('DELETE FROM user_reviews WHERE id = ?', [parsedId]);

        if (result.affectedRows > 0) {
            await updateUserAverageRating(existingReview.reviewed_user_id, connection);
            await connection.commit();
            res.status(200).json({ message: 'User review deleted successfully' });
        } else {
            // Should be caught by the existence check
            await connection.rollback();
            res.status(404).json({ error: 'User review not found' });
        }
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Failed to delete user review:', error);
        res.status(500).json({ error: 'Failed to delete user review', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

/**
 * Retrieves all reviews for a specific user (who was reviewed).
 * GET /api/user-reviews/user/:reviewedUserId
 */
exports.getReviewsForUser = async (req, res) => {
    const reviewedUserId = parseInt(req.params.reviewedUserId, 10);
    if (isNaN(reviewedUserId)) {
        return res.status(400).json({ error: 'Invalid reviewed User ID format.' });
    }
    req.query.reviewed_user_id = reviewedUserId; // Use the getAllUserReviews logic
    return exports.getAllUserReviews(req, res);
};

/**
 * Retrieves all reviews for a specific contract.
 * GET /api/user-reviews/contract/:contractId
 */
exports.getReviewsForContract = async (req, res) => {
    const contractId = parseInt(req.params.contractId, 10);
    if (isNaN(contractId)) {
        return res.status(400).json({ error: 'Invalid Contract ID format.' });
    }
    req.query.contract_id = contractId; // Use the getAllUserReviews logic
    return exports.getAllUserReviews(req, res);
};