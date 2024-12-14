const Schedule = require("./schedule.model");
const Route = require("../../routes/models/routes.model");
const Bus = require("../../bus/models/bus.model");

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

module.exports = { Schedule, Route, Bus };
