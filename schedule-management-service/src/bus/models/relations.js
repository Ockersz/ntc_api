const Bus = require("./bus.model");
const BusType = require("../../bus-type/models/bus-type.model");
const Routes = require("../../routes/models/routes.model");
Bus.belongsTo(BusType, {
  foreignKey: "busTypeId",
});

BusType.hasMany(Bus, {
  foreignKey: "busTypeId",
});

Bus.belongsTo(Routes, {
  foreignKey: "routeId",
});

Routes.hasMany(Bus, {
  foreignKey: "routeId",
});

module.exports = { Bus, BusType, Routes };
