const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Food = sequelize.define("Food", {
  name: DataTypes.STRING,
  price: DataTypes.INTEGER
});

module.exports = Food;
