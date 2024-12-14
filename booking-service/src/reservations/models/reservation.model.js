const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Reservation = sequelize.define(
  "Reservations",
  {
    reservationId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Schedules",
        key: "scheduleId",
      },
      onDelete: "CASCADE",
    },
    seatCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      max: 5,
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: false,
      defaultValue: "H",
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
  }
);

module.exports = Reservation;
