const router = require('express').Router();
const Riddle = require("../models/Riddle");
const verifyUser = require("../middlewares/verifyUser");
const User = require("../models/User");
const getCurrentRiddleId = require("../getCurrentRiddleID");

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

//checks for unauthorized requests
//if authorized riddlerDB data on req.riddlerUser
router.use(verifyUser);



router.get('/', (req, res) => {
    /* const pageToBeServed = !req.session.user.currentRiddle ? 'trackSelector' : 'question'; */
    //res.render("question", { user: req.session.user });
});



router.get('/question', async (req, res) => {
    const currentUser = req.riddlerUser;
    console.log("Current Riddle", currentUser);

    //is starter or on the first question
    if (!currentUser.riddleId || currentQuestion.charAt(1) === '0') {
        try {
            //find all riddleId that ends with 0
            const starterRiddle = await Riddle.find({ riddleId: /^.*0$/ });
            if (starterRiddle) return res.send(starterRiddle);
        } catch (err) {
            console.log("starter ridle not found [game.js]")
            res.render("error", { error: err });
        }
    }


    //existing user
    try {
        const currentRiddle = await getCurrentRiddleId(req, res);
        if (currentRiddle) return res.send(currentRiddle);
    } catch (err) {
        console.log("Riddle not found [game.js]");
        res.render("error", { error: err });
    }


});


router.get('/leaderboard', (req, res) => {
    console.log(req, res);

    // Backend has to simply request all users, and sort them by points, and then template im
    // this into a HTML table on the frontend.
    // The table has two columns, the username, and the points
});

router.post('/answer', (req, res) => {
    const answer = req.body.answer;
    const currentUser = req.session.user;


    const riddleId = await getCurrentRiddleId(req, res);

    // The frontend will send just the answer to the current question. The backend
    // needs to determine the current question the user is on, and then check if the
    // answer sent is correct. If it is, it needs to the required to update the points/
    // progress of the user in the database, and then return back the json
    // {success: true, correct: true, points: <pointsGained>}. Otherwise, it should
    // send back {success: true, correct: false, points: 0}
});

router.post('/hint', (req, res) => {
    console.log(req, res);

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

router.get('/reset', (req, res) => {
    console.log(req, res);

    // If you get a request on this route, that means the user wants to reset back from the track
    // onto the first question (the one with the three choices). Thus, you need to do the required
    // to deduce points for the same for the user, and also update the progress of the user.
    // After the reset has occured on the backend, return back {success:true, message: 'resetDone'}
    // There is an edge case to handle, when user tries to reset after he has finished all 3 tracks
    // {success: true, message: 'resetNotAllowed'}
    // In that case, don't allow the reset back and return back
});


module.exports = router;
