const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Your DB connection

const RouteCity = sequelize.define(
  "RouteCity",
  {
    routeCityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "route", // Table name
        key: "routeId",
      },
      onDelete: "CASCADE",
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "city", // Table name
        key: "cityId",
      },
      onDelete: "CASCADE",
    },
    sequenceOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "route_city",
    timestamps: true,
  }
);

module.exports = RouteCity;
