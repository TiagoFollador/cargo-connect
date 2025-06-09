require('dotenv').config();
const express = require('express');
const allRoutes = require('./app/index.js');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use('/api/cargo-connect/v1', allRoutes)
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});