const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
// var Comment = require("../models/Comment.js");
// var Article = require("../models/Article.js");
const router = express.Router();

// Scraping Route
router.get("/scrape", function (req, res) {
    // Make a request via axios for the news section of AP News
    axios.get("https://www.apnews.com/").then(function (response) {
        // Load the html body from axios into cheerio
        let $ = cheerio.load(response.data);
        // For each element with a "title" class
        $(".headline").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
   

            // If this found element had both a title and a link
            if (title && link) {
                console.log("got it!");
                // Insert the data in the scrapedData db
                // db.scrapedData.insert({
                //         title: title,
                //         link: link
                //     },
                //     function (err, inserted) {
                //         if (err) {
                //             // Log the error if one is encountered during the query
                //             console.log(err);
                //         } else {
                //             // Otherwise, log the inserted data
                //             console.log(inserted);
                //         }
                //     });
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});

module.exports = router;