const express = require("express");
const router = express.Router();
const Articles = require("../models/articles");
const exphbs = require("express-handlebars");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/saved", (req, res) => {
    res.render("saved");
});

module.exports = router;