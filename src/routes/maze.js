const router = require('express').Router();

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
router.get('/', (req, res) => {
    const pageToBeServed = !req.session.user.currentRiddle ? 'trackSelector' : 'question';
    res.render(pageToBeServed, { user: req.session.user });
});

router.get('/:riddleId', (req, res) => {
    res.send(req.params.riddleId);
});

module.exports = router;
