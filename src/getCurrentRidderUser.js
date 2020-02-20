const User = require('./models/User');

const getCurrentRiddlerUser = async (req, res) => {
    try {
        const un = req.session.user.username;
        const user = await User.findOne({ username: un });
        return user;
    } catch (err) {
        console.log('[getCurrentRiddlerUser.js] failed');
        return res.render('error', { error: 'Cannot get Riddler User' });
    }
};

module.exports = getCurrentRiddlerUser;
