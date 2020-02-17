const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  id: String,
  maintrack: [String],    //progress of the user
  finaltrack: [String],
  totalpoints: Integer
});

module.exports = mongoose.model("Attempt", attemptSchema);
