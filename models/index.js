// const db = require('../db');
const UserModel = require('./user');
// const AdventureModel = require('./adventure');
// const MealModel = require('./meal');

//* ASSOCIATIONS
// UserModel.hasMany(AdventureModel);
// UserModel.hasMany(MealModel);

// AdventureModel.belongsTo(UserModel);

// MealModel.belongsTo(UserModel);

module.exports = {
    // dbConnection: db,
    models: {
        UserModel,
        // AdventureModel,
        // MealModel
    }
};