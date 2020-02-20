const User = require('../models/User');

// eslint-disable-next-line consistent-return
const verifyUser = async (req, res, next) => {
    const currentUser = req.session.user;

    const userExists = await User.findOne({ username: currentUser.username });
    req.riddlerUser = userExists;
    if (req.riddlerUser.currentRiddle === undefined
        || req.riddlerUser.mainTracksProgress === undefined
        || req.riddlerUser.points === undefined) {
        req.riddlerUser.currentRiddle = '0';
        req.riddlerUser.mainTracksProgress = ['A0', 'B0', 'C0'];
        req.riddlerUser.points = 300;
        req.riddlerUser.hintsUsed = [];
        req.riddlerUser.markModified('mainTracksProgress');
        await req.riddlerUser.save();
    }
    if (!userExists) return res.render('error', { error: 'Not even Donald Trump is allowed in here !' });

    next();
};

module.exports = verifyUser;
