const express = require("express");
const router = express.Router();
const Articles = require("../models/articles");
const exphbs = require("express-handlebars");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/pinned", (req, res) => {
    res.render("pinned");
});

module.exports = router;