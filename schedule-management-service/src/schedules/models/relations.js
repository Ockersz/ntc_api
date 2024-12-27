const Schedule = require("./schedule.model");
const Route = require("../../routes/models/routes.model");
const Bus = require("../../bus/models/bus.model");
const RouteCity = require("../../routes/models/route_city.model");
const BusType = require("../../bus-type/models/bus-type.model");
const ScheduleTemplate = require("../../schedule-template/models/schedule-template.model");
const ScheduleTemplateDetails = require("../../schedule-template/models/schedule-template-detail.model");
const City = require("../../city/models/city.model");
Schedule.belongsTo(Route, {
  foreignKey: "routeId",
});

Route.hasMany(Schedule, {
  foreignKey: "routeId",
  onDelete: "CASCADE",
});

Schedule.belongsTo(Bus, {
  foreignKey: "busId",
});

Bus.hasMany(Schedule, {
  foreignKey: "busId",
  onDelete: "CASCADE",
});

// Route has many RouteCity
Route.hasMany(RouteCity, { foreignKey: "routeId", as: "routeCities" });
RouteCity.belongsTo(Route, { foreignKey: "routeId" });

Bus.belongsTo(BusType, {
  foreignKey: "busTypeId",
});

BusType.hasMany(Bus, {
  foreignKey: "busTypeId",
});

Schedule.belongsTo(ScheduleTemplate, {
  foreignKey: "templateId",
});

ScheduleTemplate.hasMany(Schedule, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

ScheduleTemplate.hasMany(ScheduleTemplateDetails, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

ScheduleTemplateDetails.belongsTo(ScheduleTemplate, {
  foreignKey: "templateId",
});

RouteCity.belongsTo(City, {
  foreignKey: "cityId",
});

City.hasMany(RouteCity, {
  foreignKey: "cityId",
});

module.exports = {
  Schedule,
  Route,
  Bus,
  RouteCity,
  ScheduleTemplate,
  BusType,
  ScheduleTemplateDetails,
  City,
};
