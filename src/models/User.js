const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  key: {
    type: String,
    required: true
  },
  flag: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  gameData: {
    type: String
  },
  revealedHints: {
    type: Array
  },
  count: {
    type: Number
  },
  ip: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
