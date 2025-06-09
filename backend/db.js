const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 0,
  queueLimit: 0
});

const promisePool = pool.promise(); 

promisePool.getConnection() 
  .then(connection => {
    console.log('Conectado ao banco de dados MySQL com sucesso!');
    connection.release();
  })
  .catch(error => {
    console.error('Erro ao conectar com o banco de dados MySQL:', error);
  });

module.exports = promisePool;