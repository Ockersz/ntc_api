const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * @swagger
 * definition:
 *   Bookings:
 *     type: object
 *     properties:
 *       bookingId:
 *         type: integer
 *         description: The auto-generated id of the booking
 *       scheduleId:
 *         type: integer
 *         description: The id of the schedule
 *       nicNo:
 *         type: string
 *         description: The NIC number of the user
 *       name:
 *         type: string
 *         description: The name of the user
 *       phoneNumber:
 *         type: string
 *         description: The phone number of the user
 *       email:
 *         type: string
 *         description: The email of the user
 *       seatCount:
 *         type: integer
 *         description: The number of seats booked
 *       totalAmount:
 *         type: number
 *         description: The total amount of the booking
 *       status:
 *         type: char
 *         description: The status of the booking
 *       prefferedNotificationType:
 *         type: string
 *         description: The preferred notification type
 *     required:
 *       - scheduleId
 *       - nicNo
 *       - name
 *       - email
 *       - seatCount
 *       - status
 *       - prefferedNotificationType
 *     example:
 *       scheduleId: 1
 *       nicNo: "123456789V"
 *       name: "John Doe"
 *       phoneNumber: "0771234567"
 *       email: "user@example.com"
 *       seatCount: 2
 *       totalAmount: 2000.00
 *       status: "B"
 *       prefferedNotificationType: "Email"
 */

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
