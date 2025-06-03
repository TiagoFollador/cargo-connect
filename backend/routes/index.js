const express = require('express');
const userRoutes = require('./users.js');

const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;