const pool = require("../database");

const getAllProducts = async (req, res) => {
    try {
        // SQL query to select all rows from the products table
        const sqlQuery = `SELECT * FROM products`;

        // Execute the SQL query using promise-based interface
        const [productsResult, fields] = await pool.promise().query(sqlQuery);

        // Send the result back as JSON response
        res.json(productsResult);
        
    } catch (error) {
        // Handle errors
        console.error('Error while fetching products:', error);
        res.status(500).json({ error: 'Unable to fetch products' });
    }
}

module.exports = getAllProducts;
