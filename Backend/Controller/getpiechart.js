// Assuming you're using Express.js
const pool = require("../database").promise();

const getpiechart = async (req, res) => {
    try {
        const { month } = req.query;
        const monthNumber = parseInt(month);

        const sqlQuery = `
            SELECT category, COUNT(*) as itemCount
            FROM products
            WHERE MONTH(dateOfSale) = ?
            GROUP BY category
        `;

        const [rows, fields] = await pool.query(sqlQuery, [monthNumber]);

        const pieChartData = rows.map(row => ({
            category: row.category,
            itemCount: row.itemCount
        }));

        res.json(pieChartData);
        
    } catch (error) {
        console.error('Error while fetching pie chart data:', error);
        res.status(500).json({ error: 'Unable to fetch pie chart data' });
    }
}

module.exports = getpiechart;
