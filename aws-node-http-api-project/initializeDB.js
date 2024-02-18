const axios = require('axios');
const mysql = require('mysql2/promise'); 

exports.handler = async (event, context) => {
    try {
        // Fetch seed data
        const seedData = await fetchSeedData();

        // Create MySQL connection pool
        const pool = mysql.createPool({
            connectionLimit: 10,
            host: 'product-db.c5q64m0ocxrp.us-east-1.rds.amazonaws.com',
            user: 'admin',
            password: 'Productadmin',
            database: 'products'
        });

        // Insert seed data into the database
        const sql = 'INSERT INTO products (title, price, description, category, image, sold, dateOfSale) VALUES ?';
        const values = seedData.map(item => [
            item.title,
            item.price,
            item.description,
            item.category,
            item.image,
            item.sold ? 1 : 0,
            new Date(item.dateOfSale)
        ]);

        // Await the query
        const [results] = await pool.query(sql, [values]);

        console.log('Database initialized with seed data.');

        // Get the current time
        const currentTime = new Date().toISOString();

        return { statusCode: 200, body: `Database initialized with seed data at ${currentTime}` };
    } catch (error) {
        console.error('Error initializing database:', error);
        return { statusCode: 500, body: 'Error initializing database' };
    }
};

async function fetchSeedData() {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching seed data:', error);
        return [];
    }
}
