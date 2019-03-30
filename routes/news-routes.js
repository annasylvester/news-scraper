const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
// const db = require("../models")
// var Comment = require("../models/comment.js");
var Article = require("../models/articles");

// router.get("/all", function (req, res) {
//     // Find all results from the scrapedData collection in the db
//     db.scrapedData.find({}, function (error, found) {
//         // Throw any errors to the console
//         if (error) {
//             console.log(error);
//         }
//         // If there are no errors, send the data to the browser as json
//         else {
//             res.json(found);
//         }
//     });
// });

// Scraping Route
router.get("/scrape", function (req, res) {
    // Make a request via axios for the news section of AP News
    axios.get("https://www.nationalparkstraveler.org/latest-news").then(function (response) {
        // Load the html body from axios into cheerio
        const $ = cheerio.load(response.data);
        // For each element with a "title" class
        $("article").each(function (i, element) {
            
            // Save the text and href of each link enclosed in the current element
            let title = $(element).children("h4").text();
            let partialLink = $(element).children("h4").children("a").attr("href");
            // let title = $(element).attr("title");
            // let link = $(element).attr("href");
            console.log(title);
            console.log(partialLink);
            
            //If this found element had both a title and a link
            if (title && partialLink) {
                console.log("got it!");
                //Insert the data in the scrapedData db
                let newArticle = new Article({
                    title: title,
                    link: "https://www.nationalparkstraveler.org" + partialLink
                });
                newArticle.save(function (err){
                    if (err) {
                        // Log the error if one is encountered during the query
                        console.log(err);
                    } else {
                        // Otherwise, log the inserted data
                        console.log("inserted");
                    }
                });
            };
        });
    });
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});


module.exports = router;