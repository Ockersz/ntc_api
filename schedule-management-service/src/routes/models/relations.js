const RouteCity = require("./route_city.model");
const Route = require("./routes.model");
const ScheduleTemplate = require("../../schedule-template/models/schedule-template.model");
const Schedule = require("../../schedules/models/schedule.model");

Route.hasMany(RouteCity, {
  foreignKey: "routeId",
  onDelete: "CASCADE",
});

RouteCity.belongsTo(Route, {
  foreignKey: "routeId",
});

Route.hasMany(ScheduleTemplate, {
  foreignKey: "routeId",
  onDelete: "CASCADE",
});

ScheduleTemplate.belongsTo(Route, {
  foreignKey: "routeId",
});

Route.hasMany(Schedule, {
  foreignKey: "routeId",
  onDelete: "CASCADE",
});

Schedule.belongsTo(Route, {
  foreignKey: "routeId",
});

module.exports = { Route, RouteCity };
