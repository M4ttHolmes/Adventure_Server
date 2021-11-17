const Express = require('express');
const app = Express();
require("dotenv").config();
const dbConnection = require("./db")

app.use(Express.json());

const controllers = require("./controllers");

app.use("/user", controllers.userController); 
app.use("/adventure", controllers.adventureController);
app.use("/meal", controllers.mealController);


dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });