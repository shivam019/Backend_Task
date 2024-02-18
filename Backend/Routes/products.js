const {Router} = require("express");
const initializeDB = require("../Controller/initializeDB");
const getalltransactions = require("../Controller/getalltransactions");
const getstatistics = require("../Controller/getstatistics");
const getbarchart = require("../Controller/getbarchart");
const getpiechart = require("../Controller/getpiechart");
const getchart = require("../Controller/getchart");
const getAllProducts = require("../Controller/getAllProducts")

const router = Router();

//Initialize Database

router.get("/initializeDB", initializeDB);

//Get All Transactions

router.get("/alltransactions", getalltransactions);

router.get("/allproducts", getAllProducts);


// Get Staticstics

// router.get("/statistics", getstatistics);

//Get Bar Chart

// router.get("/barchart", getbarchart);

//Get Pie Chart
// router.get("/piechart", getpiechart);


//Get combined data from staticstics, bar and pie chart api

// router.get("/getchart", getchart);


module.exports = router;