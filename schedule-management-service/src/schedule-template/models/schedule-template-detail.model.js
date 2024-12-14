const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Adjust this to your DB connection file

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
