const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
var Comments = require("../models/comments");
const Article = require("../models/articles");


///////// HOME PAGE /////////
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
            // Debugging
            // console.log(article.title);
            // console.log(article.link);
            // console.log(article.description)
            // console.log(article.imageURL)

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

// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({})
    // Execute the above query
    .exec(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });

// Pin an article
router.post("/pinned/:id", function (req, res) {
    // Use the article id to find and update it's saved property to true
    Article.updateOne({
            "_id": req.params.id
        }, {
            "saved": true
        })
        // Execute the above query
        .exec(function (err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            }
            // Log result
            else {
                console.log("doc: ", doc);
            }
        });
});


///////// PINNED PAGE /////////
// Grab an article by it's ObjectId
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({
            "_id": req.params.id
        })
        // ..and populate all of the comments associated with it
        .populate("comments")
        // now, execute our query
        .exec(function (error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});
// // Create a new comment
// router.post("/comment/:id", function(req, res) {
//     // Create a new comment and pass the req.body to the entry
//     var newComment = new Comment(req.body);
//     // And save the new comment the db
//     newComment.save(function(error, newComment) {
//       // Log any errors
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise
//       else {
//         // Use the article id to find and update it's comment
//         Article.updateOne({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
//         // Execute the above query
//         .exec(function(err, doc) {
//           // Log any errors
//           if (err) {
//             console.log(err);
//           }
//           else {
//             console.log("doc: ", doc);
//             // Or send the document to the browser
//             res.send(doc);
//           }
//         });
//       }
//     });
//   });
  
//   // Remove a saved article
//   router.post("/unsave/:id", function(req, res) {
//     // Use the article id to find and update it's saved property to false
//     Article.updateOne({ "_id": req.params.id }, { "saved": false })
//     // Execute the above query
//     .exec(function(err, doc) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//       }
//       // Log result
//       else {
//         console.log("Article Removed");
//       }
//     });
//     res.redirect("/pinned");
//   });
  



module.exports = router;