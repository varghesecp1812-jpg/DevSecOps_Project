const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("Order", {
  foodId: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending"
  }
});

module.exports = Order;
