// Define the port to open the server on 
const PORT = 8000;
// initialize express
const express = require('express');
// initialize axios
const axios = require('axios');
// initialize cheerio
const cheerio = require('cheerio');
const { response } = require('express');

// call express and put the express app in a variable
const app = express();

// create an array of newspapers to be scraped
const newspapers = [
    {
        name:"thetimes",
        address : "https://www.thetimes.co.uk/environment/climate-change"
    },
    {
        name:"guardian",
        address : "https://www.theguardian.com/environment/climate-crisis",
    },
    {
        name:"telegraph",
        address : "https://www.telegraph.co.uk/climate-change",
    }
];

// create an array where the Guardian climate data will be stored
const articles = [];
// loop through each item in the newspapers array
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response =>{
        const html = response.data
        const $ = cheerio.load(html)


        $('a:contains("climate")', html).each(function(){
           const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title, 
                url,
                source:newspaper.name
            })
        })
    })
});

// start scraping the webpage
app.get('/', (reg,res) =>{
    res.json('Welcome to my Climate Change News API');
});

// scrape the internet to get data
app.get('/news', (req,res)=>{
   res.json(articles);
})

// listen to our port
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));