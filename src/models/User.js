const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  /*key: {
    type: String
  },
  flag: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  vit: {
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
  ipAddress: {
    type: String,
    required: true
  }
});*/

module.exports = mongoose.model("User", userSchema);
