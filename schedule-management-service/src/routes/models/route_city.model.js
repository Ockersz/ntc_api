const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Your DB connection

/**
 * @swagger
 * components:
 *  schemas:
 *    RouteCity:
 *      type: object
 *      required:
 *        - routeId
 *        - cityId
 *        - sequenceOrder
 *      properties:
 *        routeCityId:
 *          type: integer
 *          description: The unique identifier for a route city
 *        routeId:
 *          type: integer
 *          description: The route identifier for the route city
 *        cityId:
 *          type: integer
 *          description: The city identifier for the route city
 *        sequenceOrder:
 *          type: integer
 *          description: The sequence order of the route city
 */

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
