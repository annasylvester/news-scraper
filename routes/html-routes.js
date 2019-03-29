const express = require("express");
const exphbs = require("express-handlebars");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello world");
    // res.render("index");
});

router.get("/saved", (req, res) => {
    res.send("Hello saved world");
    // res.render("saved");
});

module.exports = router;