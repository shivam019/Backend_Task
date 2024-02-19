const mysql = require('mysql2');
require('dotenv').config();


// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        if (connection) {
            connection.release();
        }
        return;
    }
    console.log('Connected to database');
    connection.release();
});

// Handle errors in the pool itself
pool.on('error', (err) => {
    console.error('MySQL Pool Error:', err);
});

module.exports = pool;
