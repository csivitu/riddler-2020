const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String
  },
  answer: {
    type: [String]
  },
  points: {
    type: Integer
  },
  riddleID: {
    type: String
  },
  hints: {
    type: [String]
  },
  usedHint: {
    type: Boolean
  },
  successes: {
    type: Integer
  }
});

module.exports = mongoose.model("Question");
