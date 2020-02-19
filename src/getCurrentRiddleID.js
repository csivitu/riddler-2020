const User = require('./models/User');


const getCurrentRiddleID = async (req, res) => {
    const currentUser = req.session.user;
    try {
        const riddlerUser = await User.findOne({ username: currentUser.username });
        return riddlerUser.currentRiddle;
    } catch (err) {
        console.log('[getCurrentRiddle.js] failed');
        return res.render('error', { error: 'Cannot get Riddle ID' });
    }
};

module.exports = getCurrentRiddleID;
