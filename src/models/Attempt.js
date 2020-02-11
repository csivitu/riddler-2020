const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  fullName: String,
  attempt: String,
  track: String,
  qno: Number,
  correct: Boolean
});

module.exports = mongoose.model("Attempt", attemptSchema);
