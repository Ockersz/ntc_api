const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const BusType = sequelize.define(
  "bus_type",
  {
    busTypeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM("luxury", "semi-luxury", "normal"), // 1: Active, 0: Cancelled, 2: Maintenance
      allowNull: false,
      defaultValue: "normal",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "bus_type",
    timestamps: false,
  }
);

module.exports = BusType;
