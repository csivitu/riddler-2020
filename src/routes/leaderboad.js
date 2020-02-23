const router = require('express').Router();
const User = require('../models/User');

function GetSortOrder(prop) {
    return (a, b) => {
        if (a[prop] > b[prop]) {
            return -1;
        } if (a[prop] < b[prop]) {
            return 1;
        }
        return 0;
    };
}

router.get('/', async (req, res) => {
    try {
        const lb = await User.find({});
        lb.sort(GetSortOrder('points'));

        return res.render('leaderboardShutdown', { leaderboard: lb });
    } catch (err) {
        return res.render('error', { error: err });
    }
});

module.exports = router;
