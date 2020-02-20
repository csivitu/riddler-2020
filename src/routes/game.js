const router = require('express').Router();
const Riddle = require('../models/Riddle');
const verifyUser = require('../middlewares/verifyUser');
const User = require('../models/User');
const getCurrentRiddleId = require('../getCurrentRiddleID');
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


router.get('/', (req, res) => {
    res.render('dashboard', { user: req.session.riddlerUser });
});


router.get('/question', async (req, res) => {
    const currentUser = await getCurrentRiddlerUser(req, res); // from middleware verifyUser
    console.log('Current User', currentUser);

    // is starter or on the first question
    if (!currentUser.currentRiddle || currentUser.currentRiddle[1] === '0') {
        try {
            // find all riddleId that ends with 0
            const starterRiddles = await Riddle.find({ riddleId: /^.*0$/ });
            const questions = starterRiddles.map((riddle) => riddle.question);
            if (starterRiddles) return res.render('question', { question: questions });
        } catch (err) {
            console.log('starter ridle not found [game.js]');
            return res.render('error', { error: err });
        }
    }


    // existing user
    try {
        const currentRiddleID = await getCurrentRiddleId(req, res);
        const currentRiddle = await Riddle.find({ riddleId: currentRiddleID });
        if (currentRiddle) {
            return res.render(
                'question',
                { riddle: currentRiddle.question, riddleId: getCurrentRiddleId },
            );
        }
    } catch (err) {
        console.log('Riddle not found [game.js]');
        return res.render('error', { error: err });
    }

    return true;
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
    try {
        const lb = await User.find({});
        lb.sort(GetSortOrder('points'));
        return res.render('leaderboard', { leaderboard: lb });
    } catch (err) {
        return res.render('error', { error: err });
    }
    return true;
});

router.post('/answer', async (req, res) => {
    const userAnswer = req.body.answer;
    const userRiddle = req.body.riddleId;
    const currentUser = await getCurrentRiddlerUser(req, res);


    const riddle = await Riddle.findOne({ riddleId: currentUser.riddleId });
    if (!riddle) return res.render({ error: 'riddle not found' });

    const correct = riddle.answer.find((ele) => ele === userAnswer);
    if (!correct) return res.json({ success: true, correct: false, points: 0 });


    // if on the starter
    if (!currentUser.riddleId) currentUser.riddleId = userRiddle;

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
    console.log(req, res);
    const currentUser = await getCurrentRiddlerUser(req, res);

    const riddle = await Riddle.findOne({ riddleId: currentUser.currentRiddle });
    if (!riddle) return res.render({ error: 'riddle not found' });


    // stop if all hints are used up
    const routeChar = currentUser.currentRiddle[0];
    const qno = currentUser.currentRiddle[1];
    let route;
    switch (routeChar) {
        case 'A': route = 0;
            break;
        case 'B': route = 1;
            break;
        case 'C': route = 2;
            break;
        default: return res.render('error', { error: 'Invalid Riddle Id' });
    }
    const hintIndex = currentUser.hintsUsed[route][qno];

    // invalid hintsUsed index detected
    if (!hintIndex) return res.json({ sucess: true, message: 'no hint available' });

    // user used up all hints
    if (hintIndex === process.env.noOfHints) return res.json({ success: true, message: 'used up all hints' });


    // searches for the first unused hint and serves it
    // updated hintsused value from 0 to 1

    const servedHint = riddle.hint[hintIndex];
    currentUser.hintsUsed[route][qno] += 1;
    currentUser.points -= riddle.pointsDeductedPerHint;


    // /update in dbs
    User.findOneAndUpdate({ username: currentUser.username },
        currentUser, { upsert: true },
        (err, doc) => {
            if (err) return res.render('error', { error: err });
            console.log('user saved successfully', doc);
            return true;
        });


    Riddle.findOneAndUpdate({ riddleId: currentUser.currentRiddle },
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
    const currentUser = await getCurrentRiddlerUser(req, res);
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
    const currentRI = await getCurrentRiddleId(req, res);
    const riddle = await Riddle.findOne({ riddleId: currentRI });

    for (let i = 1; i <= currentRI[1]; i += 1) {
        currentUser.points -= riddle.pointsForSuccess;
    }

    progressOverall.forEach((ele, index) => {
        if (ele.charAt(0) === currentRI.charAt(0)) {
            currentUser.mainTracksProgress[index] = `${currentRI[0]}0`;
        }
    });

    //reset hints

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
