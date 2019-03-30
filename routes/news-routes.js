const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
// var Comment = require("../models/Comment.js");
var Article = require("../models");

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
        $("h4").each(function (i, element) {
            // Save the text and href of each link enclosed in the current element
            let title = $(element).children("a").text();
            let link = $(element).children("a").attr("href");
            // let title = $(element).attr("title");
            // let link = $(element).attr("href");
            console.log(title);
            console.log(link);

            //If this found element had both a title and a link
            if (title && link) {
                console.log("got it!");
                //Insert the data in the scrapedData db
                Article.insert({
                        title: title,
                        link: link
                    },
                    function (err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        } else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                        }
                    });
            };
        });
    });
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});


module.exports = router;