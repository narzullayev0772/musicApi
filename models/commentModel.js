const mongoose = require("mongoose");

const CommentScema = new mongoose.Schema({
  user: {
    type: String,
    default: "User" + Date.now(),
  },
  description: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model("Comment", CommentScema);

exports.Comment = Comment;
