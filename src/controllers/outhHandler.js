const express = require('express');
const authorize = require('csi-accounts-express');
const atob = require('atob');

const app = express();
const router = express.Router();

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.log(e);
    return null;
  }
};

app.use(authorize({
    secret: process.env.JWT_SECRET,
    token: (req, res, next) => {
      return res.query.token; // If the token is stored in a session variable, for example
    }
}));

router.get('/', (req, res) => {
    const Info = parseJwt(req.query.token);
    res.render('pages/loginSuccess',{user:Info});
});


module.exports = router;
