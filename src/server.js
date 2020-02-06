// The first file accessed
const express = require('express');
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;


const home = require('./controllers/homeController.js');
const oauth = require('./controllers/outhHandler.js');


app.use(express.json());
app.use('/static',express.static(path.join(__dirname,"static")));
app.use(cors());


app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');





app.use('/',home);
app.use('/oauth/redirect',oauth);

app.listen(port,()=> {
    console.log(`server started at ${port}`);
})