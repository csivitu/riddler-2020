const User = require('../models/User');

const verifyUser = async (res, req, next) => {
    const currentUser = req.session.user;

    const userExists = await User.findOne({ username: currentUser.username });
    if (!userExists) return res.render('error', { error: 'Not even Donald Trump is allowed in here !' });

    req.riddlerUser = userExists;
    next();
};

module.exports = verifyUser;
