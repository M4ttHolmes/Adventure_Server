const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { models } = require("../models")


//* CREATE NEW MEAL (EP7)
router.post('/create', validateJWT, async (req, res) => {
    const {location, date, name, thoughts, rating, private} = req.body.meal;
    const {id} = req.user;
    const mealEntry = {
        location,
        date,
        name,
        thoughts,
        rating,
        private,
        userId: req.user.id
    }
    try {
        const newMeal = await models.MealModel.create(mealEntry);
        res.status(200).json({
            message: "New Meal recorded!",
            newMeal: newMeal,
        });
    } catch (err) {
        res.status(500).json({error: err})
    }
});


//* GET MY MEALS (EP8)
router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userMeals = await models.MealModel.findAll({
            where: {
                userId: id
            }
        });
            res.status(200).json({
                message: "User Meals Retrieved.",
                userMeals: userMeals,
            });
        } catch (err) {
            res.status(500).json({ error: err });
        }
});

//* UPDATE MEAL BY ID (EP9)
router.put("/update/:id", validateJWT, async(req, res) => {
    const {location, date, name, thoughts, rating, private} = req.body.meal;
    const mealId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: mealId,
            userId: userId,
        }
    };

    const updatedMeal = {
        location: location,
        date: date,
        name: name,
        thoughts: thoughts,
        rating: rating,
        private: private
    };

    try {
        await models.MealModel.update(updatedMeal, query);
        res.status(200).json({
            message: "Meal updated successfully!",
            updatedMeal});
    } catch (err) {
        res.status(500).json({error: err});
    }
});


//* DELETE -MY- MEAL BY ID (EP10)
router.delete("/:id", validateJWT, async (req, res) => {
    const userId = req.user.id;
    const mealId = req.params.id;

    try {
        const query = {
            where: {
                id: mealId,
                userId: userId
            }
        };
        await models.MealModel.destroy(query);
        res.status(200).json({ message: "Meal Deleted."});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//* GET ALL MEALS (EP13)
//! ADMIN ONLY
router.get("/all", validateJWT, async (req, res) => {
    try {
        const meals = await models.MealModel.findAll();
        res.status(200).json(meals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    });

module.exports = router;


//* DELETE -ANY- MEAL BY ID (EP14)
//! ADMIN ONLY
router.delete("/admin/:id", validateJWT, async (req, res) => {

    const mealId = req.params.id;

    try {
        const query = {
            where: {
                id: mealId,
            }
        };
        await models.MealModel.destroy(query);
        res.status(200).json({ message: "Meal Deleted."});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});