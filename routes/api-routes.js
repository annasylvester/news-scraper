const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
// const db = require("../models")
// var Comment = require("../models/comment.js");
var Article = require("../models/articles");

router.get("/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    Article.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});

// Scraping Route
router.get("/scrape", function (req, res) {
    // Make a request via axios for the news section of AP News
    axios.get("https://www.nationalparkstraveler.org/latest-news").then(function (response) {
        // Load the html body from axios into cheerio
        const $ = cheerio.load(response.data);
        // For each element with an "article" class
        $("article").each(function (i, element) {
            // Create object to gather data into
            const article = {};
            // Save the title of each element
            article.title = $(element).children("h4").text();
            // Save the href of each element
            let partialLink = $(element).children("h4").children("a").attr("href");
            article.link = "https://www.nationalparkstraveler.org" + partialLink
            // Save the description of each element
            article.description = $(element).children(".content").children(".field-abstract").text();
            // Save the image of each element
            article.imageURL = $(element).children(".content").children("a").children("img").attr("src");
            console.log(article.title);
            console.log(article.link);
            console.log(article.description)
            console.log(article.imageURL)

            Article.updateOne({
                title: article.title
            }, {
                $set: article
            }, {
                upsert: true
            }).catch(
                err => res.send(err)
            );
        });
    });
});


module.exports = router;