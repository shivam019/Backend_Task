const mysql = require('mysql2');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'product-db.c5q64m0ocxrp.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Productadmin',
    database: 'products'
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
