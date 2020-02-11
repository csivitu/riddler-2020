// The first file accessed
require("dotenv").config();
require("./models/dbInit");

const express = require("express");
const path = require("path");
const cors = require("cors");
var session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

const home = require("./controllers/homeController.js");
const oauth = require("./controllers/outhHandler.js");

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cors());
app.use(
  session({
    secret: process.env.SECRECT,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", home);
app.use("/oauth/redirect", oauth);

app.listen(port, () => {
  console.log(`server started at ${port}`);
});