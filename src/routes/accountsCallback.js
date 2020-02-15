const router = require("express").Router();
const loginValidation = require("../verification");
const User = require("../models/User");
const parseJwt = require("../parsejwtPayload");

//this handles: Base-url/outh/redirect
//i.e the callback from the accounts.csi website

router.get("/", async (req, res) => {
  let temp = parseJwt(req.query.token);
  let Info = {
    username: temp.username
  };

  const error = await loginValidation(Info);
  if (error) return res.status(400).json({ err: err.details[0].message });

  const userExists = await User.findOne({ username: Info.username });
  if (userExists) return res.status(404).json({ err: "user exists" });

  try {
    const dbUser = User.create(Info);
  } catch (err) {
    res.status(400).json({ err: "User not saved to riddler database" });
  }

  //add a error html page in the future
});

module.exports = router;
