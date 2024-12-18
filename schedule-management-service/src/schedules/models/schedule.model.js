const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * @swagger
 * components:
 *  schemas:
 *    Schedule:
 *      type: object
 *      required:
 *        - routeId
 *        - busId
 *        - templateId
 *        - startTime
 *        - endTime
 *        - status
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        scheduleId:
 *          type: integer
 *          description: The unique identifier for a schedule
 *        routeId:
 *          type: integer
 *          description: The route identifier for the schedule
 *        busId:
 *          type: integer
 *          description: The bus identifier for the schedule
 *        templateId:
 *          type: integer
 *          description: The template identifier for the schedule
 *        startTime:
 *          type: string
 *          description: The start time of the schedule
 *        endTime:
 *          type: string
 *          description: The end time of the schedule
 *        status:
 *          type: integer
 *          description: The status of the schedule
 *        createdAt:
 *          type: string
 *          description: The date and time the record was created
 *        updatedAt:
 *          type: string
 *          description: The date and time the record was updated
 */

const Schedule = sequelize.define(
  "schedules",
  {
    scheduleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Routes",
        key: "routeId",
      },
    },
    busId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buses",
        key: "busId",
      },
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ScheduleTemplates",
        key: "id",
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("1", "0", "2"), // 1: Active, 0: Cancelled, 2: Maintenance
      allowNull: false,
      defaultValue: "1",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Schedule;
