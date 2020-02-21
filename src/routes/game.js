const router = require('express').Router();
const Riddle = require('../models/Riddle');
const verifyUser = require('../middlewares/verifyUser');
const User = require('../models/User');

// This handles Baseurl/maze
// this handle Base url/maze/riddleId POST req from

router.use((req, res, next) => {
    if (req.session.user) {
        if (req.session.user) {
            next();
        }
    } else {
        res.redirect('/');
    }
});

// checks for unauthorized requests
// if authorized riddlerDB data on req.session.riddlerUser
router.use(verifyUser);


router.get('/', async (req, res) => {
    const currentRiddle = await Riddle.findOne({ riddleId: req.riddlerUser.currentRiddle });
    res.render('dashboard', { user: req.riddlerUser, currentRiddle, riddleId: req.riddlerUser.currentRiddle });
});


router.get('/question', async (req, res) => {
    let riddleId = req.riddlerUser.currentRiddle;
    const { hintsUsed } = req.riddlerUser;
    // is starter or on the first question
    if (riddleId === '0' || riddleId === 'A0' || riddleId === 'B0' || riddleId === 'C0') {
        if (req.query.setTrack) {
            if (req.query.setTrack === 'A0' || req.query.setTrack === 'B0' || req.query.setTrack === 'C0') {
                req.riddlerUser.currentRiddle = req.query.setTrack;
                riddleId = req.query.setTrack;
                await req.riddlerUser.save();
            } else {
                res.redirect('/game/question');
            }
        }
    }

    if (riddleId === '0') {
        return res.render('question', {
            riddle: '',
            riddleId,
            user: req.riddlerUser,
            hint: '',
        });
    }
    // existing user
    try {
        const currentRiddle = await Riddle.findOne({ riddleId });
        const hint = (hintsUsed.indexOf(riddleId) > -1)
            ? currentRiddle.hint : undefined;
        return res.render(
            'question',
            {
                riddle: currentRiddle.question,
                riddleId,
                user: req.riddlerUser,
                hint,
            },
        );
    } catch (err) {
        console.log('Riddle not found [game.js]');
        return res.render('error', { error: err });
    }
});


// for sorting the leaderboard
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


router.get('/leaderboard', async (req, res) => {
    const riddleId = req.riddlerUser.currentRiddle;

    try {
        const lb = await User.find({});
        lb.sort(GetSortOrder('points'));

        return res.render('leaderboard', { leaderboard: lb, user: req.riddlerUser, riddleId });
    } catch (err) {
        return res.render('error', { error: err });
    }
});

router.post('/answer', async (req, res) => {
    const m = {
        A: 0,
        B: 1,
        C: 2,
    };
    const userAnswer = req.body.answer;
    const currentUser = req.riddlerUser;
    const riddleId = currentUser.currentRiddle;
    if (!userAnswer || riddleId === '0') {
        return res.status(401).json({
            success: false,
            message: 'invalidRequest',
        });
    }
    const riddle = await Riddle.findOne({ riddleId });

    const correct = riddle.answer.find((ele) => ele.toLowerCase() === userAnswer.toLowerCase());
    if (!correct) {
        return res.render('answer', {
            correct: false,
            trackAlreadyAnswered: false,
            coupon: false,
            solvedBy: 1,
        });
    }
    const track = riddleId[0];
    let qno = parseInt(riddleId[1], 10);
    if (qno === 0) {
        const trackProgress = parseInt(currentUser.mainTracksProgress[m[track]][1], 10);
        if (trackProgress === 0) {
            currentUser.points += riddle.pointsForSuccess;
            qno = 1;
        } else if (trackProgress < 9) {
            qno = trackProgress;
        }
    } else if (qno <= 8) {
        qno += 1;
        currentUser.points += riddle.pointsForSuccess;
    }


    // creating the query + new data
    const newRiddleID = `${track}${qno}`;
    currentUser.mainTracksProgress[m[track]] = newRiddleID;

    if (qno === 9) {
        currentUser.currentRiddle = '0';
    } else {
        currentUser.currentRiddle = newRiddleID;
    }

    currentUser.markModified('mainTracksProgress');
    currentUser.markModified('points');
    await currentUser.save();
    return res.render('answer', {
        correct: true,
        trackAlreadyAnswered: false,
        coupon: false,
        solvedBy: 1,
    });
});

router.get('/hint', async (req, res) => {
    const currentUser = req.riddlerUser;
    const riddleId = currentUser.currentRiddle;

    const riddle = await Riddle.findOne({ riddleId });
    if (!riddle) return res.render({ error: 'riddle not found' });
    if (currentUser.hintsUsed.indexOf(riddleId) === -1) {
        // TODO: For first question, there are 3 questions with hints
        if (currentUser.points >= 100) {
            currentUser.hintsUsed.push(riddleId);
            currentUser.points -= 100;
            await currentUser.save();
        }
    }

    return res.redirect('/game/question');
});

router.get('/reset', async (req, res) => {
    const currentUser = req.riddlerUser;
    const riddleId = currentUser.currentRiddle;

    if (riddleId === '0' || riddleId[1] === '0') {
        res.redirect('/game');
    } else {
        const question = riddleId[1];
        let resetDeduct = ((9 - question) * 50);
        if (resetDeduct > currentUser.points) {
            resetDeduct = currentUser.points;
        }
        currentUser.points -= resetDeduct;
        currentUser.currentRiddle = '0';
        await currentUser.save();
        res.redirect('/game');
    }
});


module.exports = router;
