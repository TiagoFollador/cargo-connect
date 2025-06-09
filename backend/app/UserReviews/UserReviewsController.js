const express = require('express');
const router = express.Router();
const userReviewsRepository = require('./UserReviewsRepository');
const { authenticateToken } = require('../Auth/AuthMiddleware'); 

router.post('/', authenticateToken, userReviewsRepository.createUserReview);

router.get('/', userReviewsRepository.getAllUserReviews);

router.get('/:id', userReviewsRepository.getUserReviewById);

router.get('/user/:reviewedUserId', userReviewsRepository.getReviewsForUser);

router.get('/reviewer/:reviewerId', userReviewsRepository.getReviewsByReviewer);

router.get('/contract/:contractId', userReviewsRepository.getReviewsForContract);

router.put('/:id', authenticateToken, userReviewsRepository.updateUserReview);

router.delete('/:id', authenticateToken, userReviewsRepository.deleteUserReview);

module.exports = router;