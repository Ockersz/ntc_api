const Bus = require("./bus.model");
const BusType = require("../../bus-type/models/bus-type.model");

Bus.belongsTo(BusType, {
  foreignKey: "busTypeId",
});

BusType.hasMany(Bus, {
  foreignKey: "busTypeId",
});

module.exports = { Bus, BusType };
