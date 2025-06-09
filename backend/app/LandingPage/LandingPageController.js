const express = require('express');
const router = express.Router();
const landingPageRepository = require('./LandingPageRepository');

router.get('/testimonials', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit, 10) : 5; 

        if (isNaN(limit) || limit <= 0 || limit > 20) { 
            limit = 5; 
        }

        const testimonialsData = await landingPageRepository.getTestimonials(limit);

        res.status(200).json(testimonialsData);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials', details: error.message });
    }
});

module.exports = router;