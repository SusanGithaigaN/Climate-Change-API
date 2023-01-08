// Define the port to open the server on 
const PORT = 8000;
// initialize express
const express = require('express');
// initialize axios
const axios = require('axios');
// initialize cheerio
const cheerio = require('cheerio');

// call express and put the express app in a variable
const app = express();
// listen to our port
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));