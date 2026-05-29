const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("fooddb", "appuser", "app123", {
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = sequelize;
