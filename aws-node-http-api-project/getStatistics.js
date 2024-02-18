const mysql = require('mysql2/promise'); // Using promise-based API for MySQL

exports.handler = async (event, context) => {
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: 'product-db.c5q64m0ocxrp.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'Productadmin',
        database: 'products'
    });

    try {
        const { month } = event.queryStringParameters || {};

        const monthParam = parseInt(month);

        let totalSaleAmount = 0;
        let totalSoldItems = 0;
        let totalNotSoldItems = 0;

        const totalSaleQuery = `
            SELECT SUM(price) AS totalSaleAmount FROM products
            WHERE MONTH(dateOfSale) = ?
        `;

        const [totalSaleRows] = await pool.query(totalSaleQuery, [monthParam]);
        if (totalSaleRows.length > 0 && totalSaleRows[0].totalSaleAmount) {
            totalSaleAmount = totalSaleRows[0].totalSaleAmount;
        }

        const soldItemsQuery = `
            SELECT COUNT(*) AS totalSoldItems FROM products
            WHERE MONTH(dateOfSale) = ?
        `;
        const [soldItemsRows] = await pool.query(soldItemsQuery, [monthParam]);
        if (soldItemsRows.length > 0 && soldItemsRows[0].totalSoldItems) {
            totalSoldItems = soldItemsRows[0].totalSoldItems;
        }

        const notSoldItemsQuery = `
            SELECT COUNT(*) AS totalNotSoldItems FROM products
            WHERE MONTH(dateOfSale) = ? AND sold = 0
        `;
        const [notSoldItemsRows] = await pool.query(notSoldItemsQuery, [monthParam]);
        if (notSoldItemsRows.length > 0 && notSoldItemsRows[0].totalNotSoldItems) {
            totalNotSoldItems = notSoldItemsRows[0].totalNotSoldItems;
        }

        await pool.end();

        return {
            statusCode: 200,
            body: JSON.stringify({
                totalSaleAmount,
                totalSoldItems,
                totalNotSoldItems
            })
        };
    } catch (error) {
        console.error('Error while fetching statistics:', error);
        await pool.end();
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to fetch statistics' }),
        };
    }
};
