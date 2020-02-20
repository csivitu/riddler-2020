const router = require('express').Router();
const Riddle = require('../models/Riddle');
const verifyUser = require('../middlewares/verifyUser');
const User = require('../models/User');
const getCurrentRiddleId = require('../getCurrentRiddleID');

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


router.get('/', (req, res) => {
    res.render('dashboard', { user: req.session.riddlerUser });
});


router.get('/question', async (req, res) => {
    const currentUser = req.session.riddlerUser; // from middleware verifyUser
    console.log('Current User', currentUser);

    // is starter or on the first question
    if (!currentUser.riddleId || currentUser.riddleId.charAt(1) === '0') {
        try {
            // find all riddleId that ends with 0
            const starterRiddles = await Riddle.find({ riddleId: /^.*0$/ });
            const questions = starterRiddles.map(riddle => {
                return riddle.question;
            });
            console.log(questions);
            if (starterRiddles) return res.render('question', { question: questions });
        } catch (err) {
            console.log('starter ridle not found [game.js]');
            res.render('error', { error: err });
        }
    }


    // existing user
    try {
        const currentRiddleID = await getCurrentRiddleId(req, res);
        const currentRiddle = await Riddle.find({ riddleId: currentRiddleID });
        if (currentRiddle) return res.render('question', { riddle: currentRiddle.question });
    } catch (err) {
        console.log('Riddle not found [game.js]');
        res.render('error', { error: err });
    }

    return true;
});

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
    try {
        const lb = await User.find({});
        lb.sort(GetSortOrder('points'));
        res.render('leaderboard', { leaderboard: lb });
    } catch (err) {
        res.render('error', { error: err });
    }
    return true;
});

router.post('/answer', async (req, res) => {
    const userAnswer = req.body.answer;
    const currentUser = req.session.riddlerUser;


    const rId = await getCurrentRiddleId(req, res);
    if (rId !== currentUser.riddleId) return res.render('error', { error: 'trying to skip ahead are we ?' });

    const riddle = await Riddle.findOne({ riddleId: rId });
    if (!riddle) return res.render({ error: 'riddle not found' });

    const correct = riddle.answer.find((ele) => ele === userAnswer);
    if (!correct) return res.json({ correct: false, points: 0 });


    // crreating the new riddleID
    const track = currentUser.riddleId.charAt(0);
    let newQuestion = parseInt(currentUser.riddleId.charAt(1), 10) + 1;
    newQuestion = newQuestion.toString();

    // creating the query + new data
    const query = { username: req.session.user.username };
    const newRiddleID = `${track}${newQuestion}`;
    req.session.riddlerUser.riddleId = newRiddleID;
    const progressOverall = currentUser.mainTracksProgress;
    progressOverall.forEach((ele, index) => {
        if (ele.charAt(0) === newRiddleID.charAt(0)) {
            req.session.riddlerUser.mainTracksProgress[index] = newRiddleID;
        }
    });
    req.session.riddlerUser.points += riddle.pointsForSuccess;

    // updating the user database
    User.findOneAndUpdate(query, req.session.riddlerUser, { upsert: true }, (err) => {
        if (err) return res.render('error', { error: err });
        return res.json({ success: true, correct: true, points: riddle.pointsForSuccess });
    });

    return true;
});

router.post('/hint', async (req, res) => {
    console.log(req, res);
    const currentUser = req.session.riddlerUser;


    const rId = await getCurrentRiddleId(req, res);
    if (rId !== currentUser.riddleId) return res.render('error', { error: 'trying to skip ahead are we ?' });

    const riddle = await Riddle.findOne({ riddleId: rId });
    if (!riddle) return res.render({ error: 'riddle not found' });


    // stop if all hints are used up
    const hints = currentUser.hintsUsed
        .map((used, index) => ((used === process.env.noOfQuestions) ? riddle.hints[index] : null))
        .filter((hint) => hint != null);
    if (hints.length === 0) return res.json({ success: true, message: 'used up all hints' });


    // searches for the first unused hint and serves it
    // updated hintsused value from 0 to 1
    const index = parseInt(rId[1], 10);
    const servedHint = riddle.hint[index];
    currentUser.hintsUsed[index] += 1;


    req.session.riddlerUser.hintsUsed = currentUser.hintsUsed;
    req.session.riddlerUser.points -= riddle.pointsDeductedPerHint;


    // /update in dbs
    User.findOneAndUpdate({ username: currentUser.username },
        req.session.riddlerUser, { upsert: true },
        (err, doc) => {
            if (err) return res.render('error', { error: err });
            console.log('user saved successfully', doc);
            return true;
        });


    Riddle.findOneAndUpdate({ riddleId: rId },
        riddle, { upsert: true },
        (err) => {
            if (err) return res.render('error', { error: err });
            return res.json({ success: true, message: 'hintRequested', hint: servedHint });
        });


    return true;


    // The frontend will send no extra data, it will just send a post request on this route
    // The backend has to assume that the hint is requested for the current question the user
    // is on. Thus it must first determine the current question the user is on, and then
    // check if the user hasn't already requested a hint for that question. If the user has
    // already requested the hint, just return back {success: true, message: 'hintAlreadyRequested'}
    // If the user hasn't requested the hint yet, check if the user has enough points to take
    // the hint. If yes, then deduce the points, and grant the hint, and return back
    // {success:true, messaage: 'hintRequested', hint: '<thehint>'}
    // If no, then return back {success: true, message: 'notEnoughPoints'}
});

router.get('/reset', async (req, res) => {
    const progressOverall = req.riddleuser.mainTracksProgress;


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
    const currentRI = await getCurrentRiddleId(req, res);
    const riddle = await Riddle.findOne({ riddleId: currentRI });

    for (let i = 1; i <= currentRI[1]; i += 1) {
        req.session.riddlerUser.points -= riddle.pointsForSuccess;
    }

    progressOverall.forEach((ele, index) => {
        if (ele.charAt(0) === currentRI.charAt(0)) {
            req.session.riddlerUser.mainTracksProgress[index] = `${currentRI[0]}0`;
        }
    });

    User.findOneAndUpdate({ username: req.session.riddlerUser.username },
        req.session.riddlerUser, { upsert: true },
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
