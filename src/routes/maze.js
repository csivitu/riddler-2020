const router = require('express').Router();

// This handles Baseurl/maze
// this handle Base url/maze/riddleId POST req from

router.get('/', (req, res) => {
    console.log(req.session.user);
    const pageToBeServed = !req.session.user.currentRiddle ? 'trackSelector' : 'question';
    res.render(pageToBeServed, { user: req.session.user });
});

router.get('/:riddleId', (req, res) => {
    res.send(req.params.riddleId);
});

module.exports = router;