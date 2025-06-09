const db = require('../../db.js');
const UserRepository = require('../Users/UserRepository'); 
const ShipmentContractRepository = require('../ShipmentContracts/ShipmentContractRepository'); 

async function updateUserAverageRating(reviewedUserId, connection) {
    try {
        const [reviews] = await connection.query(
            'SELECT rating FROM user_reviews WHERE reviewed_user_id = ?',
            [reviewedUserId]
        );

        let averageRating = null;
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = parseFloat((totalRating / reviews.length).toFixed(2)); 
        }

        const tripsCompleted = reviews.length;

        await connection.query(
            'UPDATE users SET rating = ?, trips_completed = ? WHERE id = ?',
            [averageRating, tripsCompleted, reviewedUserId]
        );
        console.log(`Updated average rating for user ${reviewedUserId} to ${averageRating} and trips to ${tripsCompleted}`);
    } catch (error) {
        console.error(`Error updating average rating for user ${reviewedUserId}:`, error);
        throw error; 
    }
}

exports.createUserReview = async (req, res) => {
    const {
        reviewer_user_id, reviewed_user_id, contract_id, rating, comment
    } = req.body;

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

        if (!await UserRepository.checkUserExistsInTransaction(reviewer_user_id, connection)) {
            await connection.rollback();
            return res.status(404).json({ error: `Reviewer user with id ${reviewer_user_id} not found.` });
        }
        if (!await UserRepository.checkUserExistsInTransaction(reviewed_user_id, connection)) {
            await connection.rollback();
            return res.status(404).json({ error: `Reviewed user with id ${reviewed_user_id} not found.` });
        }
        const [contractExists] = await connection.query('SELECT id FROM shipment_contracts WHERE id = ?', [contract_id]);
        if (contractExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: `Contract with id ${contract_id} not found.` });
        }

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

        await updateUserAverageRating(reviewed_user_id, connection);

        await connection.commit();

        const [createdReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [newReviewId]); 
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
    if (comment !== undefined) { 
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

        if (req.user && req.user.userId !== existingReview.reviewer_user_id) {
            await connection.rollback();
            return res.status(403).json({ error: 'Forbidden: You can only update your own reviews.' });
        } else if (!req.user) { 
            await connection.rollback();
            return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
        }


        const [result] = await connection.query('UPDATE user_reviews SET ? WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            if (fieldsToUpdate.rating !== undefined) {
                await updateUserAverageRating(existingReview.reviewed_user_id, connection);
            }
            await connection.commit();

            const [updatedReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [parsedId]);
            res.status(200).json(updatedReview[0]);
        } else {
            await connection.rollback(); 
            const [currentReview] = await db.query('SELECT * FROM user_reviews WHERE id = ?', [parsedId]);
            res.status(200).json(currentReview[0]); 
        }
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Failed to update user review:', error);
        res.status(500).json({ error: 'Failed to update user review', details: error.message });
    } finally {
        if (connection) connection.release();
    }
};

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

        const isAdmin = req.user && req.user.roles && req.user.roles.includes('admin');
        if (req.user && (req.user.userId === existingReview.reviewer_user_id || isAdmin)) {
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

exports.getReviewsForUser = async (req, res) => {
    const reviewedUserId = parseInt(req.params.reviewedUserId, 10);
    if (isNaN(reviewedUserId)) {
        return res.status(400).json({ error: 'Invalid reviewed User ID format.' });
    }
    req.query.reviewed_user_id = reviewedUserId; 
    return exports.getAllUserReviews(req, res);
};

exports.getReviewsByReviewer = async (req, res) => {
    const reviewerId = parseInt(req.params.reviewerId, 10);
    if (isNaN(reviewerId)) {
        return res.status(400).json({ error: 'Invalid reviewer ID format.' });
    }
    req.query.reviewer_user_id = reviewerId; 
    return exports.getAllUserReviews(req, res);
};

exports.getReviewsForContract = async (req, res) => {
    const contractId = parseInt(req.params.contractId, 10);
    if (isNaN(contractId)) {
        return res.status(400).json({ error: 'Invalid Contract ID format.' });
    }
    req.query.contract_id = contractId; 
    return exports.getAllUserReviews(req, res);
};

exports.getPublicTestimonials = async (limit = 5) => { 
    const query = `
        SELECT
            ur.id AS reviewId,
            reviewer.name AS reviewerName,
            ur.rating,
            ur.comment,
            MIN(r.name) AS reviewedUserType
        FROM user_reviews ur
        JOIN users reviewer ON ur.reviewer_user_id = reviewer.id
        JOIN users reviewed_user ON ur.reviewed_user_id = reviewed_user.id
        JOIN user_roles uro ON reviewed_user.id = uro.user_id
        JOIN roles r ON uro.role_id = r.id
        WHERE ur.comment IS NOT NULL AND ur.comment != '' AND ur.rating >= 4
        GROUP BY ur.id, reviewer.name, ur.rating, ur.comment
        ORDER BY ur.rating DESC, ur.created_at DESC
        LIMIT ?;
    `;
    const [testimonials] = await db.query(query, [parseInt(limit, 10)]);
    return testimonials;
};