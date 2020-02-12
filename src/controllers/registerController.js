const router = require("express").Router();

// register
router.get("/", (req, res) => {
  res.render("pages/registerPage");
});

module.exports = router;
