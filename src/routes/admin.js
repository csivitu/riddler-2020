const router = require("express").Router();


router.get('/', (req, res) => {
    res.render("adminLogin");
})

router.post('/', (req, res) => {
    const adminLoginCred = req.body;
    res.render("adminPanel", { user: adminLoginCred });
})

module.exports = router;