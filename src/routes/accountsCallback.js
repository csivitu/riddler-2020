const router = require("express").Router();
const loginValidation = require("../verification");
const User = require("../models/User");
const parseJwt = require("../parsejwtPayload");
const getIpAddress = require("../getIpAddress");

//this handles: Base-url/outh/redirect
//i.e the callback from the accounts.csi website

router.get("/", async (req, res) => {
  let temp = parseJwt(req.query.token);
  const apiRes = await getIpAddress();
  let Info = {
    username: temp.username,
    ip: apiRes.ip,
  };

  const err = await loginValidation(Info);
  if (err) return res.render("error", { error: err.details[0].message });

  const userExists = await User.findOne({ username: Info.username });
  if (userExists) return res.render("error", { error: "You have already registered !" });

  try {
    const dbUser = await User.create(Info);
    res.render("home.ejs", { user: dbUser });
  } catch (err) {
    res.render("error", { error: "Opps Server Error!" });
  }

  //add a error html page in the future
});

module.exports = router;
