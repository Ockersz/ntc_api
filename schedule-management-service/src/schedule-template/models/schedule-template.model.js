const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database"); // Adjust this to your DB connection file

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
