// Dependencies
const mongoose = require("mongoose");

// Create Schema
const Schema = mongoose.Schema;

// Article Schema
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    comments: [{
        type: Schema.ObjectId,
        ref: "Comment"
    }]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;