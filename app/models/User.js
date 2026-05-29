const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: DataTypes.STRING,
  password: DataTypes.STRING
});

module.exports = User;
