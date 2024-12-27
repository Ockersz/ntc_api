const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Replace with your DB connection

/**
 * @swagger
 * components:
 *   schemas:
 *     Route:
 *      type: object
 *      required:
 *        - routeName
 *        - estimatedTime
 *        - distance
 *      properties:
 *         routeId:
 *          type: integer
 *          description: The unique identifier for a route
 *         routeName:
 *          type: string
 *          description: The name of the route
 *         estimatedTime:
 *          type: string
 *          description: The estimated time for the route
 *         distance:
 *          type: number
 *          description: The distance of the route
 */

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
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    tableName: "route",
    timestamps: true,
  }
);

module.exports = Route;
