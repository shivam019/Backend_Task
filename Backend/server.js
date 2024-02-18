const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require('mysql2');

const PORT = 9090;

const pool = require("./database");

const productRoute = require("./Routes/products");
app.use('/product', productRoute);

app.use(cors()); 

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
