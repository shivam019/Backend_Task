const express = require("express")
const app = express();
const cors = require("cors")
const axios = require('axios');
const mysql = require('mysql');
const initializeDB = require('./Controller/initializeDB');

const PORT = 9090;

app.use(cors()); 

//Mysql Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'products'
});


pool.on('error', (err) => {
    console.error('MySQL Pool Error:', err);
});



initializeDB(pool);

app.get('/transactions', async (req, res) => {
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      res.status(500).json({ error: 'Failed to fetch transaction data' });
    }
  });
  

app.listen(PORT, ()=> {console.log("Sucessfully, Connected to the Server")})
