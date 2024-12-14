const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Replace with your DB connection

const Route = sequelize.define(
  "Route",
  {
    routeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "route",
    timestamps: true,
  }
);

module.exports = Route;
