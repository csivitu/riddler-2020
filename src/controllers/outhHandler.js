const express = require("express");
const atob = require("atob");

const app = express();
const router = express.Router();

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.log(e);
    return null;
  }
};

router.get("/", (req, res) => {
  const Info = parseJwt(req.query.token);
  res.render("pages/loginSuccess", { user: Info });
});

module.exports = router;
