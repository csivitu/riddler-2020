const express = require("express");
const atob = require("atob");
const router = express.Router();
const getApiData = require("../httpRequests");

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log(e);
    return null;
  }
};

router.get("/", (req, res) => {
  let Info = parseJwt(req.query.token);
  //getting user's ip and adding to the login credentials
  getApiData("https://api.ipify.org?format=json", { method: "GET" }).then(data => {
    console.log(data.ip);
    Info["ip"] = data.ip;
    res.render("pages/home", { user: Info });
  });
});

module.exports = router;
