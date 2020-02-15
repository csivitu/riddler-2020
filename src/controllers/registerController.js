const router = require("express").Router();
const path = require("path");

//base url/

// register
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../static", "/html/registerPage.html"));
});

router;

module.exports = router;
