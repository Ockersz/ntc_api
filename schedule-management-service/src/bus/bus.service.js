const { Bus, BusType } = require("./models/relations");

class BusService {
  static async createBus(busData, userId, res) {
    if (
      !busData.permitId ||
      !busData.vehicleRegNo ||
      !busData.busTypeId ||
      !busData.seatCount ||
      !busData.routeId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (userId === undefined || userId === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const busDataReconstructed = {
      ...busData,
      operatorId: userId,
    };

    const transaction = await Bus.sequelize.transaction();

    try {
      const bus = await Bus.create(busDataReconstructed, { transaction });
      await transaction.commit();
      return res.status(201).json(bus);
    } catch (error) {
      transaction.rollback();
      return res.status(500).json({ message: error.message });
    }
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

  static async getBusById(busId, res) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const bus = await Bus.findByPk(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.status(200).json(bus);
  }

  static async getBusByVehicleRegNo(vehicleRegNo, res) {
    if (!vehicleRegNo) {
      return res
        .status(400)
        .json({ message: "Vehicle Registration Number is required" });
    }

    const bus = await Bus.findOne({ where: { vehicleRegNo } });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.status(200).json(bus);
  }

  static async updateBus(busId, updateData, res) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    if (
      !updateData.vehicleRegNo ||
      !updateData.busTypeId ||
      !updateData.seatCount ||
      !updateData.routeId ||
      !updateData.status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bus = await Bus.findByPk(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const busExists = await Bus.findOne({
      where: {
        vehicleRegNo: updateData.vehicleRegNo,
        id: { [Bus.sequelize.Op.ne]: busId },
      },
    });

    if (busExists) {
      return res
        .status(400)
        .json({ message: "Vehicle Registration Number already in use" });
    }

    if (updateData.seatCount < 0 || updateData.seatCount > 100) {
      return res
        .status(400)
        .json({ message: "Seat count must be between 0 and 100" });
    }

    const updated = await bus.update(updateData);

    return res.status(200).json({
      message: "Bus updated successfully",
      bus: updated,
    });
  }

  static async deleteBus(busId, res, userId) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    if (userId === undefined || userId === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bus = await Bus.findByPk(busId);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (bus.operatorId !== userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You are not the owner of this bus" });
    }

    const deleted = await bus.update(
      {
        status: "0",
      },
      { where: { busId } }
    );

    return res.status(200).json({
      message: "Bus deleted successfully",
      bus: deleted,
    });
  }
}

module.exports = BusService;
