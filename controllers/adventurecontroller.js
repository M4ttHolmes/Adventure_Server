const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models")


//* CREATE NEW ADVENTURE (EP3)
router.post('/create', validateJWT, async (req, res) => {
    const {location, date, advName, actType, thoughts, rating, private} = req.body.adventure;
    const {id} = req.user;
    const adventureEntry = {
        location,
        date,
        advName,
        actType,
        thoughts,
        rating,
        private,
        userId: req.user.id
    }
    try {
        const newAdventure = await models.AdventureModel.create(adventureEntry);
        res.status(200).json({
            message: "New Adventure in the books!",
            newAdventure: newAdventure,
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
});


//* GET MY ADVENTURES (EP4)
router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userAdventures = await models.AdventureModel.findAll({
            where: {
                userId: id
            }
        });
            res.status(200).json({
                message: "User Adventures Retrieved.",
                userAdventures: userAdventures,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
});

//* UPDATE ADVENTURE BY ID (EP5)
router.put("/update/:id", validateJWT, async(req, res) => {
    const {location, date, advName, actType, thoughts, rating, private} = req.body.adventure;
    const adventureId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: adventureId,
            userId: userId,
        }
    };

    const updatedAdventure = {
        location: location,
        date: date,
        advName: advName,
        actType: actType,
        thoughts: thoughts,
        rating: rating,
        private: private
    };

    try {
        await models.AdventureModel.update(updatedAdventure, query);
        res.status(200).json({
            message: "Adventure updated successfully!",
            updatedAdventure});
    } catch (err) {
        res.status(500).json({error: err});
    }
});


//* DELETE -MY- ADVENTURE BY ID (EP6)
router.delete("/:id", validateJWT, async (req, res) => {
    const userId = req.user.id;
    const advId = req.params.id;

    try {
        const query = {
            where: {
                id: advId,
                userId: userId
            }
        };
        await models.AdventureModel.destroy(query);
        res.status(200).json({ message: "Adventure Deleted."});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//* GET ALL ADVENTURES (EP12)
//! ADMIN ONLY
router.get("/all", validateJWT, async (req, res) => {
    try {
        const adventures = await models.AdventureModel.findAll();
        res.status(200).json(adventures);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    });

//* DELETE -ANY- ADVENTURE BY ID (EP16)
//! ADMIN ONLY
router.delete("/admin/:id", validateJWT, async (req, res) => {
    const advId = req.params.id;

    try {
        const query = {
            where: {
                id: advId,
            }
        };
        await models.AdventureModel.destroy(query);
        res.status(200).json({ message: "Adventure Deleted."});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});


module.exports = router;