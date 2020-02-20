const router = require('express').Router();
const Riddle = require('../models/Riddle');
const verifyUser = require('../middlewares/verifyUser');
const User = require('../models/User');
const getCurrentRiddlerUser = require('../getCurrentRidderUser');

// This handles Baseurl/maze
// this handle Base url/maze/riddleId POST req from

router.use((req, res, next) => {
    if (req.session.user) {
        if (req.session.user.scope.indexOf('csi') > -1) {
            next();
        } else {
            res.redirect('/');
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
            req.riddlerUser.currentRiddle = req.query.setTrack;
            riddleId = req.query.setTrack;
            await req.riddlerUser.save();
        }
    }

    if (riddleId === '0') {
        return res.render('question', {
            riddle: '',
            riddleId,
            user: req.session.user,
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
                user: req.session.user,
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
            return 1;
        } if (a[prop] < b[prop]) {
            return -1;
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
    const userAnswer = req.body.answer;
    const userRiddle = req.body.riddleId;
    const currentUser = await getCurrentRiddlerUser(req, res);

    // if on the starter
    if (!currentUser.riddleId) currentUser.riddleId = userRiddle;


    const riddle = await Riddle.findOne({ riddleId: currentUser.riddleId });
    if (!riddle) return res.render('error', { error: 'riddle not found' });

    const correct = riddle.answer.find((ele) => ele === userAnswer);
    if (!correct) return res.json({ success: true, correct: false, points: 0 });


    // creating the new riddleID
    const track = currentUser.riddleId.charAt(0);
    let newQuestion = parseInt(currentUser.riddleId.charAt(1), 10) + 1;
    newQuestion = newQuestion.toString();

    // creating the query + new data
    const query = { username: currentUser.username };
    const newRiddleID = `${track}${newQuestion}`;
    currentUser.riddleId = newRiddleID;
    const progressOverall = currentUser.mainTracksProgress;
    progressOverall.forEach((ele, index) => {
        if (ele.charAt(0) === newRiddleID.charAt(0)) {
            currentUser.mainTracksProgress[index] = newRiddleID;
        }
    });
    currentUser.points += riddle.pointsForSuccess;

    // updating the user database
    User.findOneAndUpdate(query, currentUser, { upsert: true }, (err) => {
        if (err) return res.render('error', { error: err });
        return res.json({ success: true, correct: true, points: riddle.pointsForSuccess });
    });

    return true;
});

router.post('/hint', async (req, res) => {
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

    return res.redirect('/question');
});

router.get('/reset', async (req, res) => {
    const currentUser = req.riddlerUser;
    const progressOverall = currentUser.mainTracksProgress;


    // completed all tracks
    let edgeCase = true;
    progressOverall.forEach((ele) => {
        if (ele.charAt(1) !== process.env.noOfQuestions) {
            edgeCase = false;
        }
    });
    if (edgeCase) {
        return res.json({
            sucess: true,
            message: 'Reset not allowed',
        });
    }


    // reset Current track progress
    const currentRI = req.riddlerUser.riddleId;
    const riddle = await Riddle.findOne({ riddleId: currentRI });

    for (let i = 1; i <= currentRI[1]; i += 1) {
        currentUser.points -= riddle.pointsForSuccess;
    }

    progressOverall.forEach((ele, index) => {
        if (ele.charAt(0) === currentRI.charAt(0)) {
            currentUser.mainTracksProgress[index] = `${currentRI[0]}0`;
        }
    });

    // reset hints

    User.findOneAndUpdate({ username: currentUser.username },
        currentUser, { upsert: true },
        (err) => {
            if (err) return res.render('error', { error: err });
            return res.send({ success: true, message: 'resetDone' });
        });

    return true;
    // If you get a request on this route, that means the user wants to reset back from the track
    // onto the first question (the one with the three choices). Thus, you need to do the required
    // to deduce points for the same for the user, and also update the progress of the user.
    // After the reset has occured on the backend, return back {success:true, message: 'resetDone'}
    // There is an edge case to handle, when user tries to reset after he has finished all 3 tracks
    // {success: true, message: 'resetNotAllowed'}
    // In that case, don't allow the reset back and return back
});


module.exports = router;
