const router = require('express').Router();

// login
router.get('/', (req, res) => {
    res.render('pages/landingPage');
});


module.exports = router;
