const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  /*
  ip: {
    type: String,
    required: true
  },
  key: {
    type: String
  },
  flag: {
    type: String
  },
  status: {
    type: String
  },
  gameData: {
    type: String
  },
  revealedHints: {
    type: Array
  },
  count: {
    type: Number
  }
});*/

module.exports = mongoose.model("User", userSchema);
