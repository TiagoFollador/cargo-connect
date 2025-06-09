const express = require('express');
const router = express.Router();
const companyContactRepository = require('./CompanyContactRepository');

router.post('/', companyContactRepository.createCompanyContact);
 
router.get('/', async (req, res) => {
    try {
        const contactDetails = await companyContactRepository.getAllCompanyContacts();
        if (contactDetails) {
            res.status(200).json(contactDetails);
        } else {
            res.status(404).json({ error: 'Company contact information not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve company contact information.', details: error.message });
    }
});

router.get('/:id', companyContactRepository.getCompanyContactById);

router.put('/:id', companyContactRepository.updateCompanyContact);

router.delete('/:id', companyContactRepository.deleteCompanyContact);

module.exports = router;