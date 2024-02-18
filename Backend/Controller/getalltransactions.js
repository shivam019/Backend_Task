const pool = require("../database").promise();

const getAllTransactions = async (req, res) => {
    try {
        let { search = '', page = 1, perPage = 10, month } = req.query;

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

        res.json({
            total: totalCount,
            transactions: transactionsResult
        });
        
    } catch (error) {
        console.error('Error while fetching transaction data:', error);
        res.status(500).json({ error: 'Unable to fetch transaction data' });
    }
}

module.exports = getAllTransactions;
