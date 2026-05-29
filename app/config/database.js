const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "crudapp",
  "cruduser",
  "password123",
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;
