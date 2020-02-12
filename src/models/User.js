const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  mobile: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    index: true
  },
  regNum: {
    type: String,
    required: true
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
});

module.exports = mongoose.model("User", userSchema);
