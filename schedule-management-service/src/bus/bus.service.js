const { Bus, BusType } = require("./models/relations");

class BusService {
  static async createBus(busData, userId) {
    const busDataReconstructed = {
      ...busData,
      operatorId: userId,
    };

    return await Bus.create(busDataReconstructed);
  }

  static async getAllBuses() {
    return await Bus.findAll({
      include: [
        {
          model: BusType,
        },
      ],
    });
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
