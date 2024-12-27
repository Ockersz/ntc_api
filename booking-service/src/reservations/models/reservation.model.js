const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * @swagger
 * definition:
 *   Reservations:
 *     type: object
 *     properties:
 *       reservationId:
 *         type: integer
 *         description: The auto-generated id of the reservation
 *       scheduleId:
 *         type: integer
 *         description: The id of the schedule
 *       seatCount:
 *         type: integer
 *         description: The number of seats reserved
 *         maximum: 5
 *       status:
 *         type: char
 *         description: The status of the reservation
 *         default: "H"
 *     required:
 *       - scheduleId
 *       - seatCount
 *     example:
 *       scheduleId: 1
 *       seatCount: 3
 */
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
