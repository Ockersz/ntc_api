const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new instance of Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_UNAME,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_TYPE,
  }
);

module.exports = sequelize;
