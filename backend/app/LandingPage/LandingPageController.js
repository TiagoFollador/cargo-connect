const express = require('express');
const router = express.Router();
const landingPageRepository = require('./LandingPageRepository');

/**
 * GET /api/landingpage/testimonials
 * Retrieves testimonials for the landing page.
 * Query params: limit (optional, number)
 */
router.get('/testimonials', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit, 10) : 5; // Default to 5 testimonials

        if (isNaN(limit) || limit <= 0 || limit > 20) { // Added an upper bound for sanity
            limit = 5; // Reset to default if invalid
        }

        const testimonialsData = await landingPageRepository.getTestimonials(limit);

        // The data from the repository query is structured to match the expected response.
        res.status(200).json(testimonialsData);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials', details: error.message });
    }
});

module.exports = router;