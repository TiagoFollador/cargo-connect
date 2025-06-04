const express = require('express');
const router = express.Router();
const companyContactRepository = require('./CompanyContactRepository');

// POST /api/company-contact
router.post('/', companyContactRepository.createCompanyContact);
 
// GET /api/company-contact
router.get('/', async (req, res) => {
    try {
        const contactDetails = await companyContactRepository.getPrimaryCompanyContact();
        if (contactDetails) {
            res.status(200).json(contactDetails);
        } else {
            res.status(404).json({ error: 'Company contact information not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve company contact information.', details: error.message });
    }
});

// GET /api/company-contact/:id
router.get('/:id', companyContactRepository.getCompanyContactById);

// PUT /api/company-contact/:id
router.put('/:id', companyContactRepository.updateCompanyContact);

// DELETE /api/company-contact/:id
router.delete('/:id', companyContactRepository.deleteCompanyContact);

module.exports = router;