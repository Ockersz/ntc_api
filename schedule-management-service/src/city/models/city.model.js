const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Replace with your DB connection

const City = sequelize.define(
  "City",
  {
    cityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "city",
    timestamps: true,
  }
);

module.exports = City;
