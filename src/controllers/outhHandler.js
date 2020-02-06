const express = require("express");
const authorize = require('csi-accounts-express');



const app =express();
const router = express.Router();

app.use(authorize({
    secret: process.env.JWT_SECRET,
}));


router.get('/',(req,res) =>{
    const data = req.query;
    console.log(req.body);
    /* code to check state MISSING PLZ ADD VERY IMPORTANT*/
     res.render('pages/loginSuccess',{user:req.body});
});


module.exports = router;