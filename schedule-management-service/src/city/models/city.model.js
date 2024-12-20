const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Replace with your DB connection

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *         cityId:
 *          type: integer
 *          description: The unique identifier for a city
 *         name:
 *          type: string
 *          description: The name of the city
 */

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
