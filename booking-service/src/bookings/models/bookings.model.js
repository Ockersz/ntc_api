const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Bookings = sequelize.define(
  "Bookings",
  {
    bookingId: {
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
    nicNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      max: 5,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: false,
      defaultValue: "B",
    },
    prefferedNotificationType: {
      type: DataTypes.ENUM,
      values: ["SMS", "Email", "Both"],
      allowNull: false,
      defaultValue: "EMAIL",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

module.exports = Bookings;
