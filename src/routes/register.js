const router = require("express").Router();
const path = require("path");

//this handles base url/

// register
router.get("/", (req, res) => {
  res.render("registerPage.ejs");
});

module.exports = router;
