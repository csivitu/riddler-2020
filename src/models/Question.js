const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String
  },
  qno: {
    type: Number
  },
  track: {
    type: String
  },
  answer: {
    type: [String]
  },
  solvedBy: {
    type: Number
  },
  hint: {
    type: String
  },
  story: {
    track: String,
    question: String
  }
});

module.exports = mongoose.model("Question");
