// The first file accessed
require("dotenv").config();
require("./models/dbInit");

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const callback = require("./routes/accountsCallback.js");
const register = require("./routes/register.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", register);
app.use("/oauth/redirect", callback);

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


/*app.get('*',function(req,res){
  res.sendFile(__dirname+'src/views/error.ejs');
})
*/
