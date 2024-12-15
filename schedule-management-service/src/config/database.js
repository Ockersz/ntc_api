const { Sequelize } = require("sequelize");
//import dotenv
require("dotenv").config();
const { DB_NAME, DB_UNAME, DB_PASS, DB_HOST, DB_PORT, DB_TYPE } = process.env;

// Create a new instance of Sequelize
const sequelize = new Sequelize(DB_NAME, DB_UNAME, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_TYPE,
});

module.exports = sequelize;
