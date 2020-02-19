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

router.post('/answer', async (req, res) => {
    const userAnswer = req.body.answer;
    const currentUser = req.riddlerUser;


    const rId = await getCurrentRiddleId(req, res);
    if (rId != currentUser.riddleId) return res.render("error", { error: "trying to skip ahead are we ?" });

    const riddle = await Riddle.findOne({ riddleId: rId });
    if (!riddle) return res.render({ error: "riddle not found" });

    let correct = riddle.answer.find((ele) => ele === userAnswer);
    if (!correct) return res.json({ correct: false, points: 0 });


    //crreating the new riddleID
    const track = currentUser.riddleId.charAt(0);
    let newQuestion = parseInt(currentUser.riddleId.charAt(1)) + 1;
    newQuestion = newQuestion.toString();

    //creating the query
    let query = { 'username': req.user.username };
    let newRiddleID = `${track}${newQuestion}`;
    req.riddlerUser.riddleId = newRiddleID;
    req.riddlerUser.points += riddle.pointsForSuccess;

    //updating the user database
    try {
        User.findOneAndUpdate(query, req.riddlerUser, { upsert: true }, function (err, doc) {
            if (err) return res.render("error", { error: err });
            return res.json({ correct: true, points: riddle.pointsForSuccess });
        });
    } catch (error) {
        res.render("error", { error: "[game.js] Unable to update riddle" });
    }
});

router.post('/hint', async (req, res) => {
    console.log(req, res);
    const currentUser = req.riddleId;



    const rId = await getCurrentRiddleId(req, res);
    if (rId != currentUser.riddleId) return res.render("error", { error: "trying to skip ahead are we ?" });

    const riddle = await Riddle.findOne({ riddleId: rId });
    if (!riddle) return res.render({ error: "riddle not found" });


    //stop if all hints are used up
    const hints = riddle.hintsUsed
        .map(used, index => (used === 0) ? riddle.hints[index] : null)
        .filter(hint => hint != null);
    if (hints.length == 0) return res.json({ success: true, message: "used up all hints" });


    //searches for the first unused hint and serves it 
    //updated hintsused value from 0 to 1
    const index = riddle.hintsUsed.indexOf(0);
    const servedHint = riddle.hint[index];
    riddle.hintsUsed[index] = 1;


    ///update in db [only thing that changes is hintsused array]
    //return value
    try {
        Riddle.findOneAndUpdate({ riddleId: rId }, riddle, { upsert: true }, function (err, doc) {
            if (err) return res.render("error", { error: err });
            return res.json({ success: true, message: 'hintRequested', hint: servedHint });;
        });
    } catch (error) {
        res.render("error", { error: "[game.js] Unable to update riddle" });
    }





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
