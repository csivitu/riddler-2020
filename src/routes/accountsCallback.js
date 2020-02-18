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
        token: (req) => req.query.token,
    }),
);

router.get('/', async (req, res) => {
    req.session.user = req.user;
    const temp = req.user;
    const apiRes = await getIpAddress();
    const Info = {
        username: temp.username,
        ip: apiRes.ip,
    };

    const err = await loginValidation(Info);
    if (err) return res.render('error', { error: err.details[0].message });

    const userExists = await User.findOne({ username: Info.username });

    if (!userExists) {
        // New user
        try {
            await User.create(Info);
        } catch (err2) {
            res.render('error', { error: 'Oops Server Error!' });
        }
    }

    if (req.session.user.scope.indexOf('csi') > -1) {
        res.redirect('/maze');
    } else {
        res.redirect('/');
    }
});

module.exports = router;
