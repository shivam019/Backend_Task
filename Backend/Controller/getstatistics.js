const pool = require("../database").promise();

const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

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

        res.json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        console.error('Error while fetching statistics:', error);
        res.status(500).json({ error: 'Unable to fetch statistics' });
    }
}

module.exports = getStatistics;
