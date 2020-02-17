// The first file accessed
require("dotenv").config();
//require("./models/dbInit");

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

const register = require("./controllers/registerController.js");
const auth = require("./controllers/authController");

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

app.use("/", register);
app.use("/oauth/redirect", auth);

app.listen(port, function(err){
  if(err){
    console.log('error while starting the server');
  }
  else{
    console.log(`server started at ${port}`);
  }
});

/*
app.get('/',function(req,res){
  res.send("Riddler")
})

app.get('/question', function (req , res){
  res.sendFile(__dirname+)
})
*/


app.get('*',function(req,res){
  res.sendFile(__dirname+'src/views/error.ejs');
})
