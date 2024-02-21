const mysql = require('mysql2/promise'); 
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'productdb.c5q64m0ocxrp.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Productadmin',
    database: 'products'
});

exports.handler = async (event, context) => {
    try {
        let { search = '', page = 1, perPage = 10, month } = event.queryStringParameters || {};

        search = search.trim();
        month = parseInt(month);

        let isSearchEmpty = false;
        if (search === '') {
            isSearchEmpty = true;
        }

        let searchCondition = "";
        let searchParam = [];
        if (!isSearchEmpty) {
            searchCondition = "AND (title LIKE ? OR description LIKE ? OR price LIKE ?)";
            searchParam = [`%${search}%`, `%${search}%`, `%${search}%`];
        }

        const limit = parseInt(perPage, 10);
        const offset = (parseInt(page, 10) - 1) * limit;

        let monthCondition = "";
        let monthParam = [];
        if (!isNaN(month)) {
            monthCondition = "AND MONTH(dateOfSale) = ?";
            monthParam = [month];
        }

        const sqlQuery = `
            SELECT * FROM products
            WHERE 1=1
            ${searchCondition}
            ${monthCondition}
            LIMIT ? OFFSET ?
        `;

        const values = isSearchEmpty ? [limit, offset] : [...searchParam, ...monthParam, limit, offset];

        const [transactionsResult] = await pool.query(sqlQuery, values);

        const totalCount = transactionsResult.length;

        return {
            statusCode: 200,
            body: JSON.stringify({
                total: totalCount,
                transactions: transactionsResult
            })
        };
        
    } catch (error) {
        console.error('Error while fetching transaction data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Unable to fetch transaction data' })
        };
    }
};
