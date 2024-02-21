const mysql = require('mysql2/promise'); // Using promise-based API for MySQL

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

        
        const priceRanges = [
            { range: '0 - 100', min: 0, max: 100 },
            { range: '101 - 200', min: 101, max: 200 },
            { range: '201 - 300', min: 201, max: 300 },
            { range: '301 - 400', min: 301, max: 400 },
            { range: '401 - 500', min: 401, max: 500 },
            { range: '501 - 600', min: 501, max: 600 },
            { range: '601 - 700', min: 601, max: 700 },
            { range: '701 - 800', min: 701, max: 800 },
            { range: '801 - 900', min: 801, max: 900 },
            { range: '901 - above', min: 901, max: 10000 }
        ];

        const priceRangesCount = [];

        for (const range of priceRanges) {
            const countQuery = `
                SELECT COUNT(*) AS itemCount FROM products
                WHERE MONTH(dateOfSale) = ? AND price >= ? AND price <= ?
            `;
            const [countRows] = await pool.query(countQuery, [monthParam, range.min, range.max]);
            const itemCount = countRows[0].itemCount;
            priceRangesCount.push({ range: range.range, count: itemCount });
        }

        await pool.end();

        return {
            statusCode: 200,
            body: JSON.stringify(priceRangesCount),
        };
    } catch (error) {
        console.error('Error while fetching price ranges for bar chart:', error);
        await pool.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to fetch price ranges for bar chart' }),
        };
    }
};
