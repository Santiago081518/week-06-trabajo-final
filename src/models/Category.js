const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Category = sequelize.define('category', {
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
});

module.exports = Category;