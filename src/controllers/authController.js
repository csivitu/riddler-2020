const express = require("express");
const atob = require("atob");
const router = express.Router();
const loginValidation = require("../verification");
const getApiData = require("../httpRequests");
const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");

//Baser url/outh/redirect

/* 
router.get("/", (req, res) => {
  let Info = parseJwt(req.query.token);
  //getting user's ip and adding to the login credentials
  getApiData("https://api.ipify.org?format=json", { method: "GET" }).then(data => {
    Info["ip"] = data.ip;
    loginValidation(Info).then(err => {
      if (err) {
        res.send({ err: err.details[0].message });
      } else {
        User.create(Info)
          .then(res.send("User success fully registered"))
          .catch(err => console.log("User db error:", err));
      }
    });
  });
}); */

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static", "/html/login.html"));
});

module.exports = router;
