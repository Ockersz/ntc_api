const RouteCity = require("./route_city.model");
const Route = require("./routes.model");
const ScheduleTemplate = require("../../schedule-template/models/schedule-template.model");
const Schedule = require("../../schedules/models/schedule.model");
const City = require("../../city/models/city.model");

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

RouteCity.belongsTo(City, {
  foreignKey: "cityId",
});

City.hasMany(RouteCity, {
  foreignKey: "cityId",
});

module.exports = { Route, RouteCity, City };
