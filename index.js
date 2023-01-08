// Define the port to open the server on 
// const PORT = 8000;
// change the port options for heroku
const PORT = process.env.PORT || 8000
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
        address : "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        name:"guardian",
        address : "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name:"telegraph",
        address : "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk"
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
                url: newspaper.base + url,
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

// get information from one newspaper article
app.get('/news/:newspaperId', (req, res) => {
    // grab whatever newspaper ID you pass infront of news
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name ==newspaperId)[0].base    

    axios.get(newspaperAddress)
        .then(response =>{
            const html = response.data
            const $ = cheerio.load(html)
            // collect all articles
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId

                })
            })
            // display in browser
            res.json(specificArticles)
        })
        // catch any errors
        .catch(err => console.log(err))
})
// listen to our port
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));