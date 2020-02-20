const User = require("./models/User");

const getCurrentRiddlerUser = async (req) => {
    try {
        const un = req.session.user.username;
        let user = await User.find({ username: un });
        return user;
    } catch (err) {
        console.log('[getCurrentRiddlerUser.js] failed');
        return res.render('error', { error: 'Cannot get Riddler User' });
    }
}

module.exports = getCurrentRiddlerUser;