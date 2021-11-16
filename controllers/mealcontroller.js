const Express = require('express');
const router = Express.Router();

router.get("/practice", (req, res) => {
    res.send("Hey! This is a practice Route!")
});

module.exports = router;