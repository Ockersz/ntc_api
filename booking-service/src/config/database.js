const { Sequelize } = require("sequelize");

// Create a new instance of Sequelize
const sequelize = new Sequelize("ntc", "root", "root", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

module.exports = sequelize;
