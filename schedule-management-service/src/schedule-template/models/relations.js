const ScheduleTemplate = require("./schedule-template.model");
const ScheduleTemplateDetail = require("./schedule-template-detail.model");
const Route = require("../../routes/models/routes.model");
const Bus = require("../../bus/models/bus.model");

ScheduleTemplate.hasMany(ScheduleTemplateDetail, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

ScheduleTemplateDetail.belongsTo(ScheduleTemplate, {
  foreignKey: "templateId",
});

ScheduleTemplate.belongsTo(Route, {
  foreignKey: "routeId",
});

ScheduleTemplateDetail.belongsTo(Bus, {
  foreignKey: "busId",
});

module.exports = { ScheduleTemplate, ScheduleTemplateDetail, Route, Bus };
