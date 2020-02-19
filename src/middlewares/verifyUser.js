const User = require('../models/User');

// eslint-disable-next-line consistent-return
const verifyUser = async (req, res, next) => {
    const currentUser = req.session.user;

    const userExists = await User.findOne({ username: currentUser.username });
    if (!userExists) return res.render('error', { error: 'Not even Donald Trump is allowed in here !' });

    req.riddlerUser = userExists;
    next();
};

module.exports = verifyUser;
