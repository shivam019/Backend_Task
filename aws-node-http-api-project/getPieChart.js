const mysql = require('mysql2/promise'); 

exports.handler = async (event, context) => {
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'productdb.c5q64m0ocxrp.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'Productadmin',
        database: 'products'
    });

    try {

        const { month } = event.queryStringParameters || {};

        const monthParam = parseInt(month);

        const sqlQuery = `
            SELECT category, COUNT(*) as itemCount
            FROM products
            WHERE MONTH(dateOfSale) = ?
            GROUP BY category
        `;

        const [rows, fields] = await pool.query(sqlQuery, [monthParam]);

        const pieChartData = rows.map(row => ({
            category: row.category,
            itemCount: row.itemCount
        }));

        await pool.end();

        return {
            statusCode: 200,
            body: JSON.stringify(pieChartData),
        };
        
    } catch (error) {
        console.error('Error while fetching pie chart data:', error);
        await pool.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to fetch pie chart data' }),
        };
    }
};
