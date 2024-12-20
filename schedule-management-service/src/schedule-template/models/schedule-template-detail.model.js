const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Adjust this to your DB connection file

/**
 * @swagger
 * components:
 *  schemas:
 *   ScheduleTemplateDetail:
 *      type: object
 *      required:
 *        - templateId
 *        - busId
 *        - startTime
 *        - endTime
 *        - status
 *      properties:
 *        detailId:
 *          type: integer
 *          description: The unique identifier for a schedule template detail
 *        templateId:
 *          type: integer
 *          description: The identifier for the schedule template
 *        busId:
 *          type: integer
 *          description: The identifier for the bus
 *        startTime:
 *          type: string
 *          description: The start time of the schedule template detail
 *        endTime:
 *          type: string
 *          description: The end time of the schedule template detail
 *        status:
 *          type: integer
 *          description: The status of the schedule template detail
 */

const ScheduleTemplateDetail = sequelize.define(
  "scheduletemplatedetail",
  {
    detailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "ScheduleTemplate", // Ensure this matches the name of your ScheduleTemplate model
        key: "templateId",
      },
      onDelete: "CASCADE",
    },
    busId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Bus", // Ensure this matches the name of your Bus model
        key: "busId",
      },
      onDelete: "CASCADE",
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // 1 = Active
    },
  },
  {
    tableName: "scheduletemplatedetail",
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

module.exports = ScheduleTemplateDetail;
