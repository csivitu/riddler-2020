const router = require('express').Router();

// this handles base url/

function getRandomState(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// register
router.get('/', (req, res) => {
    const state = getRandomState(16);

    const accountsUrl = `https://accounts.csivit.com/oauth/authorize?clientId=${process.env.CLIENT_ID}&redirectUrl=${process.env.REDIRECT_URL}&state=${state}`;
    res.render('registerPage', { user: req.session.user, accountsUrl });

    if (req.session.user) {
        req.session.destroy();
    }
});


// For all routes that need to template something on the frontend
// and the page isn't ready yet, just make sure for now that the
// route queries the required data that needs to be templated from the database, later we
// can fill in the code to template it onto the page made by the
// frontend team.

// Routes should return {success: false, message: 'serverError'} whenever some exception
// occurs on the route (like a mongodb operation fails, for exam[le])

router.get('/dashboard', (req, res) => {
    console.log(req, res);
    //query out the user #task1 
    // Only accessible if the user is logged into riddler. It should
    // return a page which shows information like the user's current
    // progress (the track he's on currently, the question no on the track,
    // the no of points he has currently, no of questions he has anwered
    // correctly). All this needs to be templated onto a page, and shown
    // to the user. There should be a button called "Resume Game" which
    // linkes to the /game route.
});

module.exports = router;
