const express = require("express");
const router = express.Router();
const loginValidation = require("../verification");
const getApiData = require("../httpRequests");
const User = require("../models/User");
const path = require("path");
const parseJwt = require("../parsejwtPayload");

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
  let temp = parseJwt(req.query.token);
  let Info = {
    username: temp.username
  };
  //getting user's ip and adding to the login credentials
  getApiData("https://api.ipify.org?format=json", { method: "GET" })
    .then(data => {
      Info["ip"] = data.ip;
      loginValidation(Info).then(err => {
        if (err) {
          res.status(500).send({ err: err.details[0].message });
        } else {
          User.create(Info)
            .then(res.sendFile(path.join(__dirname, "../static", "/html/login.html")))
            .catch(err => res.status(500).send(err)); //add a error html page in the future
        }
      });
    })
    .catch(err => console.log("/outh/redirect"));
});

module.exports = router;
