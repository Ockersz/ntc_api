const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Adjust this to your DB connection file

/**
 * @swagger
 * components:
 *  schemas:
 *    ScheduleTemplate:
 *      type: object
 *      required:
 *        - routeId
 *        - name
 *        - recurrencePattern
 *        - status
 *        - startDate
 *        - endDate
 *        - direction
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        templateId:
 *          type: integer
 *          description: The unique identifier for a schedule template
 *        routeId:
 *          type: integer
 *          description: The route identifier for the schedule template
 *        name:
 *          type: string
 *          description: The name of the schedule template
 *        recurrencePattern:
 *          type: string
 *          description: The recurrence pattern of the schedule template
 *        status:
 *          type: integer
 *          description: The status of the schedule template
 *        startDate:
 *          type: string
 *          description: The start date of the schedule template
 *        endDate:
 *          type: string
 *          description: The end date of the schedule template
 *        direction:
 *          type: string
 *          description: The direction of the schedule template
 *        createdAt:
 *          type: string
 *          description: The date and time the record was created
 *        updatedAt:
 *          type: string
 *          description: The date and time the record was updated
 */

const ScheduleTemplate = sequelize.define(
  "schedule_template",
  {
    templateId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Routes", // Ensure this matches the name of your Route model
        key: "routeId",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    recurrencePattern: {
      type: DataTypes.ENUM("daily", "odd", "even", "custom"),
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // 1 = Active
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("outbound", "return"),
      allowNull: false,
      defaultValue: "outbound",
    },
  },
  {
    tableName: "schedule_template",
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

module.exports = ScheduleTemplate;
