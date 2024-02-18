const { Router } = require("express");
const initializeDB = require("../Controller/initializeDB");
const getalltransactions = require("../Controller/getalltransactions");
const getStatistics = require("../Controller/getstatistics");
const getbarchart = require("../Controller/getbarchart");
const getpiechart = require("../Controller/getpiechart");
const axios = require('axios');

const router = Router();

// Initialize Database
router.get("/initializeDB", initializeDB);

// Get All Transactions
router.get("/alltransactions", getalltransactions);


// Get Statistics
router.get("/statistics", getStatistics);

// Get Bar Chart
router.get("/barchart", getbarchart);

// Get Pie Chart
router.get("/piechart", getpiechart);

router.get('/combined-data', async (req, res) => {
    try {
        const { month } = req.query;

        const statisticsResponse = await axios.get(`http://localhost:9090/product/statistics?month=${month}`);
        const barChartResponse = await axios.get(`http://localhost:9090/product/barchart?month=${month}`);
        const pieChartResponse = await axios.get(`http://localhost:9090/product/piechart?month=${month}`);

        statistics = statisticsResponse.data;
        barChart = barChartResponse.data;
        pieChart =  pieChartResponse.data;

        const combinedData = {
            statistics,
            barChart,
            pieChart
        };

        res.json(combinedData);
    } catch (error) {
        console.error('Error while fetching combined data:', error);
        res.status(500).json({ error: 'Unable to fetch combined data' });
    }
});

module.exports = router;


module.exports = router;
