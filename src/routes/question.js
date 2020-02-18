const router = require("express").Router();

//This handles Baseurl/maze
//this handle Base url/maze/riddleId

router.get("/", (req, res) => {
  res.json({
    msg: "reached the maze route",
    user: req.session.user
  });
});

module.exports = router;
