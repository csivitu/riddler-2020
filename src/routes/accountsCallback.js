const router = require('express').Router();
const authorize = require('csi-accounts-express');
const loginValidation = require('../verification');
const User = require('../models/User');
const getIpAddress = require('../getIpAddress');

// this handles: Base-url/outh/redirect
// i.e the callback from the accounts.csi website

router.use(
    authorize({
        secret: process.env.SECRECT,
        token: (req, res, next) => req.query.token, // If the token is stored in a session variable, for example

    }),
);

router.get('/', async (req, res) => {
    const temp = req.user;
    const apiRes = await getIpAddress();
    const Info = {
        username: temp.username,
        ip: apiRes.ip,
    };

    const err = await loginValidation(Info);
    if (err) return res.render('error', { error: err.details[0].message });

    const userExists = await User.findOne({ username: Info.username });

    if (userExists) {
    // Existing user
        req.session.user = userExists;
        res.redirect('/maze');
    } else {
    // New user
        try {
            const dbUser = await User.create(Info);
            req.session.user = dbUser;
            res.redirect('/maze');
        } catch (err) {
            res.render('error', { error: 'Opps Server Error!' });
        }
    }

    // add a error html page in the future
});

module.exports = router;
