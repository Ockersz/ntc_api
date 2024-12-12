const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

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
