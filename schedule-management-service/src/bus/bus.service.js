const Bus = require("./models/bus.model");

class BusService {
  static async createBus(busData) {
    return await Bus.create(busData);
  }

  static async getAllBuses() {
    return await Bus.findAll();
  }

  static async getBusById(busId) {
    return await Bus.findByPk(busId);
  }

  static async getBusByVehicleRegNo(vehicleRegNo) {
    return await Bus.findOne({ where: { vehicleRegNo } });
  }

  static async updateBus(busId, updateData) {
    const bus = await Bus.findByPk(busId);
    if (!bus) throw new Error("Bus not found");
    return await bus.update(updateData);
  }

  static async deleteBus(busId) {
    const bus = await Bus.findByPk(busId);
    if (!bus) throw new Error("Bus not found");
    await bus.update(
      {
        status: "0",
      },
      { where: { busId } }
    );
    return true;
  }
}

module.exports = BusService;
