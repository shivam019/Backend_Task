const axios = require('axios');

async function fetchSeedData() {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching seed data:', error);
        return [];
    }
}



async function initializeDB(pool) {
    try {
        const seedData = await fetchSeedData();
        if (seedData.length === 0) {
            console.log('No seed data found.');
            return;
        }
    
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
    
        pool.query(sql, [values], (error, results) => {
            if (error) {
                console.error('Error initializing database:', error.message);
            } else {
                console.log('Database initialized with seed data.');
            }
        });
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

module.exports = initializeDB;