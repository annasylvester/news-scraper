// Dependencies
const mongoose = require('mongoose');

// Create Schema
const Schema = mongoose.Schema;

// Comments Schema
const CommentSchema = new Schema({
  body: String
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;