const express = require('express');
const router = express.Router();
const companyContactRepository = require('./CompanyContactRepository');

// Create a new company contact entry
// POST /api/company-contact
router.post('/', companyContactRepository.createCompanyContact);

// Get all company contact entries (the "research" function)
// GET /api/company-contact
router.get('/', companyContactRepository.getAllCompanyContacts);

// Get a single company contact entry by ID
// GET /api/company-contact/:id
router.get('/:id', companyContactRepository.getCompanyContactById);

// Update a company contact entry by ID
// PUT /api/company-contact/:id
router.put('/:id', companyContactRepository.updateCompanyContact);

// Delete a company contact entry by ID
// DELETE /api/company-contact/:id
router.delete('/:id', companyContactRepository.deleteCompanyContact);

module.exports = router;