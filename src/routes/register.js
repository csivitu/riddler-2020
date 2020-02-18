const router = require('express').Router();

// this handles base url/

// register
router.get('/', (req, res) => {
    res.render('registerPage');
});

module.exports = router;
