// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
let exphbs = require("express-handlebars")

// Set the port
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Require Routes
var htmlRoutes = require("./routes/html-routes");
const newsRoutes = require("./routes/news-routes")

// JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Access public folder
app.use(express.static("./public/assets"));

// Handlebars set up
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Routing
app.use(htmlRoutes);
app.use(newsRoutes);

// DB set up
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/news-scraper";
mongoose.connect(MONGODB_URI);
console.log("connected to db")

// Start it up!
app.listen(PORT, function () {
    console.log("Listening on port: " + PORT);
})