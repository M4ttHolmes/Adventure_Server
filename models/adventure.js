const { DataTypes } = require("sequelize");
const db = require("../db");

const Adventures = db.define("adventures", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    advName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    thoughts: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
});

module.exports = Adventures;