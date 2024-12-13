const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Bus = sequelize.define(
  "Bus",
  {
    busId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    permitId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    vehicleRegNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("1", "0"), // 1 = Active, 0 = Inactive
      defaultValue: "1",
    },
    type: {
      type: DataTypes.ENUM("luxury", "normal"),
      allowNull: false,
    },
    seatCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: true, // NULL for unassigned buses
      references: {
        model: "route",
        key: "routeId",
      },
      onDelete: "SET NULL", // If a route is deleted, set this to NULL
    },
  },
  {
    tableName: "bus",
    timestamps: true,
  }
);

module.exports = Bus;
