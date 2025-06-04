const express = require('express');
const router = express.Router();
const userReviewsRepository = require('./UserReviewsRepository');
const { authenticateToken } = require('../Auth/AuthMiddleware'); // Assuming auth middleware for update/delete

// Create a new user review
// POST /api/user-reviews
router.post('/', authenticateToken, userReviewsRepository.createUserReview);

// Get all user reviews (research function with filters)
// GET /api/user-reviews
router.get('/', userReviewsRepository.getAllUserReviews);

// Get a single user review by ID
// GET /api/user-reviews/:id
router.get('/:id', userReviewsRepository.getUserReviewById);

// Get all reviews for a specific user (who was reviewed)
// GET /api/user-reviews/user/:reviewedUserId
router.get('/user/:reviewedUserId', userReviewsRepository.getReviewsForUser);

// Get all reviews for a specific contract
// GET /api/user-reviews/contract/:contractId
router.get('/contract/:contractId', userReviewsRepository.getReviewsForContract);

// Update a user review by ID (only rating and comment)
// PUT /api/user-reviews/:id
// Requires authentication, and user must be the original reviewer.
router.put('/:id', authenticateToken, userReviewsRepository.updateUserReview);

// Delete a user review by ID
// DELETE /api/user-reviews/:id
// Requires authentication, user must be original reviewer or admin.
router.delete('/:id', authenticateToken, userReviewsRepository.deleteUserReview);

module.exports = router;