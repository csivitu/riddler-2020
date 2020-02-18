const router = require('express').Router();
const path = require('path');

//this handles base url/

// register
router.get('/', (req, res) => {
  res.render('registerPage');
});


// For all routes that need to template something on the frontend
// and the page isn't ready yet, just make sure for now that the 
// route queries the required data that needs to be templated from the database, later we 
// can fill in the code to template it onto the page made by the 
// frontend team.

// Routes should return {success: false, message: 'serverError'} whenever some exception
// occurs on the route (like a mongodb operation fails, for exam[le])

router.get('/dashboard', (req, res) => {
    // Only accessible if the user is logged into riddler. It should
    // return a page which shows information like the user's current
    // progress (the track he's on currently, the question no on the track,
    // the no of points he has currently, no of questions he has anwered
    // correctly). All this needs to be templated onto a page, and shown
    // to the user. There should be a button called "Resume Game" which
    // linkes to the /game route.
});

router.get('/game', (req, res) => {
    // Get the user's current question, and template it onto the frontend
    // The frontend page will also have a textbox to enter the answer, a button
    // to submit the answer (this will just send a post request to /answer)
    // and a button to get a hint (this will send a post request to /hint).
    // Additionally, this route also needs to check if for the current question
    // the user has already taken a hint for the question. If yes, it also needs
    // to template on the hint with the question.
});

router.get('/leaderboard', (req, res) => {
    // Backend has to simply request all users, and sort them by points, and then template im
    // this into a HTML table on the frontend. The table has two columns, the username, and the points
});

router.post('/answer', (req, res) => {
    // The frontend will send just the answer to the current question. The backend
    // needs to determine the current question the user is on, and then check if the
    // answer sent is correct. If it is, it needs to the required to update the points/
    // progress of the user in the database, and then return back the json
    // {success: true, correct: true, points: <pointsGained>}. Otherwise, it should
    // send back {success: true, correct: false, points: 0}
});

router.post('/hint', (req, res) => {
    // The frontend will send no extra data, it will just send a post request on this route
    // The backend has to assume that the hint is requested for the current question the user
    // is on. Thus it must first determine the current question the user is on, and then
    // check if the user hasn't already requested a hint for that question. If the user has
    // already requested the hint, just return back {success: true, message: 'hintAlreadyRequested'}
    // If the user hasn't requested the hint yet, check if the user has enough points to take
    // the hint. If yes, then deduce the points, and grant the hint, and return back {success:true, messaage: 'hintRequested', hint: '<thehint>'}
    // If no, then return back {success: true, message: 'notEnoughPoints'}
});

router.get('/reset', (req, res) => {
    // If you get a request on this route, that means the user wants to reset back from the track
    // onto the first question (the one with the three choices). Thus, you need to do the required
    // to deduce points for the same for the user, and also update the progress of the user.
    // After the reset has occured on the backend, return back {success:true, message: 'resetDone'}
    // There is an edge case to handle, when the user tries to reset after he has finished all 3 tracks
    // In that case, don't allow the reset back and return back {success: true, message: 'resetNotAllowed'}
});

module.exports = router;
