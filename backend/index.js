const express = require('express');
const allRoutes = require('./routes/index.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/cargo-conect/v1', allRoutes)
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});