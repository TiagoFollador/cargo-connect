const db = require('../../db.js');

exports.createCompanyContact = async (req, res) => {
    const {
        address, phone, email, working_hours, latitude, longitude
    } = req.body;

    if (!address || !phone || !email || !working_hours) {
        return res.status(400).json({ error: 'Missing required fields: address, phone, email, working_hours are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    const phoneRegex = /^\d{10,}$/; 
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format.' });
    }
    if (latitude !== undefined && latitude !== null && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
        return res.status(400).json({ error: 'latitude must be a number between -90 and 90 or null.' });
    }
    if (longitude !== undefined && longitude !== null && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
        return res.status(400).json({ error: 'longitude must be a number between -180 and 180 or null.' });
    }

    try {

        const contactData = {
            address, phone, email, working_hours,
            latitude: latitude === undefined ? null : latitude,
            longitude: longitude === undefined ? null : longitude,
        };

        const [result] = await db.query('INSERT INTO company_contact SET ?', contactData);
        const newContactId = result.insertId;

        const [createdContact] = await db.query('SELECT * FROM company_contact WHERE id = ?', [newContactId]);

        res.status(201).json(createdContact[0]);

    } catch (error) {
        console.error('Failed to create company contact:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A contact entry with this unique field already exists.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to create company contact', details: error.message });
    }
};

exports.getAllCompanyContacts = async (req, res) => {
    try {
        const [contacts] = await db.query('SELECT * FROM company_contact ORDER BY id ASC');
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Failed to retrieve company contacts:', error);
        res.status(500).json({ error: 'Failed to retrieve company contacts', details: error.message });
    }
};

exports.getPrimaryCompanyContact = async () => {
    try {
        const [contacts] = await db.query('SELECT address, phone, email, working_hours, latitude, longitude FROM company_contact ORDER BY id ASC LIMIT 1');
        if (contacts.length > 0) {
            return contacts[0];
        }
        return null;
    } catch (error) {
        console.error('Failed to retrieve primary company contact:', error);
        throw error;
    }
};

exports.getCompanyContactById = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [contacts] = await db.query('SELECT * FROM company_contact WHERE id = ?', [parsedId]);
        if (contacts.length > 0) {
            res.status(200).json(contacts[0]);
        } else {
            res.status(404).json({ error: 'Company contact not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve company contact:', error);
        res.status(500).json({ error: 'Failed to retrieve company contact', details: error.message });
    }
};

exports.updateCompanyContact = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const {
        address, phone, email, working_hours, latitude, longitude
    } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No fields to update provided.' });
    }

    const fieldsToUpdate = {};
    if (address !== undefined) fieldsToUpdate.address = address;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (email !== undefined) fieldsToUpdate.email = email;
    if (working_hours !== undefined) fieldsToUpdate.working_hours = working_hours;
    if (latitude !== undefined) { 
        if (latitude !== null && (typeof latitude !== 'number' || latitude < -90 || latitude > 90)) {
            return res.status(400).json({ error: 'latitude must be a number between -90 and 90 or null.' });
        }
        fieldsToUpdate.latitude = latitude;
    }
    if (longitude !== undefined) { 
        if (longitude !== null && (typeof longitude !== 'number' || longitude < -180 || longitude > 180)) {
            return res.status(400).json({ error: 'longitude must be a number between -180 and 180 or null.' });
        }
        fieldsToUpdate.longitude = longitude;
    }

    if (fieldsToUpdate.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldsToUpdate.email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
    }
    if (fieldsToUpdate.phone !== undefined) {
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(fieldsToUpdate.phone)) {
            return res.status(400).json({ error: 'Invalid phone number format.' });
        }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update provided.' });
    }

    try {
        const [existingContacts] = await db.query('SELECT id FROM company_contact WHERE id = ?', [parsedId]);
        if (existingContacts.length === 0) {
            return res.status(404).json({ error: 'Company contact not found' });
        }

        const [result] = await db.query('UPDATE company_contact SET ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [fieldsToUpdate, parsedId]);

        if (result.affectedRows > 0) {
            const [updatedContact] = await db.query('SELECT * FROM company_contact WHERE id = ?', [parsedId]);
            res.status(200).json(updatedContact[0]);
        } else {
            res.status(200).json({ message: 'No data changed for company contact.' });
        }
    } catch (error) {
        console.error('Failed to update company contact:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A contact entry with this unique field already exists.', details: error.message });
        }
        res.status(500).json({ error: 'Failed to update company contact', details: error.message });
    }
};

exports.deleteCompanyContact = async (req, res) => {
    const parsedId = parseInt(req.params.id, 10);
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    try {
        const [result] = await db.query('DELETE FROM company_contact WHERE id = ?', [parsedId]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Company contact deleted successfully' });
        } else {
            res.status(404).json({ error: 'Company contact not found' });
        }
    } catch (error) {
        console.error('Failed to delete company contact:', error);
        res.status(500).json({ error: 'Failed to delete company contact', details: error.message });
    }
};