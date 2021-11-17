const router = require("express").Router();
const { models } = require("../models");
const { UniqueConstraintError } = require('sequelize/lib/errors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateJWT = require("../middleware/validate-jwt")
const AccessControl = require("accesscontrol");


//* USER REGISTRATION ENDPOINT (EP1)
router.post("/register", async (req, res) => {
    const { email, password, firstName, lastName, role } = req.body.user;
    try {
        let User = await models.UserModel.create({
            email,
            password: bcrypt.hashSync(password, 13),
            firstName,
            lastName,
            role
        });

        let token = jwt.sign({id: User.id, email: User.email}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            });
        } else {
        res.status(500).json({
            message: "Failed to register user"
        })
        }
    }
});


//* USER LOGIN ENDPOINT (EP2)
router.post("/login", async (req, res) => {
    const { email, password } = req.body.user;

    try {
        let loginUser = await models.UserModel.findOne({
            where: {
                email: email,
            }
        });

    if (loginUser) {
        let passwordComparison = await bcrypt.compare(password, loginUser.password);
        if (passwordComparison) {
            let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

            res.status(200).json({
                user: loginUser,
                message: "User successfully logged in!",
                sessionToken: token
            });

        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        }

    } else {
        res.status(401).json({
            message: "Incorrect email or password"
        })
    }

    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
})

// Access Control
const ac = new AccessControl();

ac.grant("Admin").readAny("all").deleteAny("delete");
ac.grant("User")


//* GET ALL USERS (EP11)
//! Admin Only
router.get("/all", validateJWT, async (req, res) => {
    const permission = ac.can(req.user.role).readAny("all")

    if(permission.granted) {
        try {
            const users = await models.UserModel.findAll();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    } else {
        res.status(403).json({message: "Not an Admin."});
    }
});


//* DELETE USER BY ID (EP15)
//! ADMIN ONLY
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const permission = ac.can(req.user.role).deleteAny("delete")

    if (permission.granted) {
        const userId = req.params.id

        try {
            const query = {
                where: {
                    id: userId
            },
        };
        
            await models.UserModel.destroy(query)
            res.status(200).json({
                message: "User Deleted"
            })
        } catch(err) {
            res.status(500).json({
                message: "Failed to delete User"
            })
        }
    } else {
        res.status(403).json({message: "Not an Admin."});
    }
})

module.exports = router;