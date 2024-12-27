const { Bus, BusType, Routes } = require("./models/relations");
const { Op } = require("sequelize");
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

    const routeExists = await Routes.findOne({
      where: { routeId: busData.routeId, status: "1" },
    });

    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const busTypeExists = await BusType.findOne({
      where: { busTypeId: busData.busTypeId },
    });

    if (!busTypeExists) {
      return res.status(404).json({ message: "Bus Type not found" });
    }

    const vehicleRegNoExists = await Bus.findOne({
      where: [{ vehicleRegNo: busData.vehicleRegNo, status: "1" }],
    });

    if (vehicleRegNoExists) {
      return res.status(400).json({
        message: "Vehicle Registration Number  already in use",
      });
    }

    const permitIdExists = await Bus.findOne({
      where: { permitId: busData.permitId, status: "1" },
    });

    if (permitIdExists) {
      return res.status(400).json({ message: "Permit ID already in use" });
    }

    const busDataReconstructed = {
      ...busData,
      operatorId: userId,
    };

    const transaction = await Bus.sequelize.transaction();

    try {
      const bus = await Bus.create(busDataReconstructed, { transaction });
      await transaction.commit();
      const reconstructedBus = await Bus.findOne({
        where: { busId: bus.busId },
        include: [
          {
            model: BusType,
            attributes: { exclude: ["busTypeId"] },
          },
          {
            model: Routes,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status", "routeId"],
            },
          },
        ],
        attributes: ["busId", "permitId", "vehicleRegNo", "seatCount"],
      });
      return res.status(201).json(reconstructedBus);
    } catch (error) {
      transaction.rollback();
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllBuses(userId, res, vehicleRegNo) {
    if (userId === undefined || userId === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let whereClause = {
      operatorId: userId,
      status: "1",
    };

    if (vehicleRegNo) {
      whereClause = {
        ...whereClause,
        vehicleRegNo: {
          [Op.like]: `%${vehicleRegNo}%`,
        },
      };
    }

    const busses = await Bus.findAll({
      include: [
        {
          model: BusType,
          attributes: { exclude: ["busTypeId"] },
        },
        {
          model: Routes,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status", "routeId"],
          },
        },
      ],
      attributes: ["busId", "permitId", "vehicleRegNo", "seatCount"],
      where: whereClause,
    });

    if (busses.length === 0) {
      const bussesWithNoOperator = await Bus.findAll({
        include: [
          {
            model: BusType,
            attributes: { exclude: ["busTypeId"] },
          },
        ],
        attributes: [
          "busId",
          "permitId",
          "vehicleRegNo",
          "seatCount",
          "routeId",
        ],
        where: {
          ...whereClause,
          operatorId: null,
        },
      });

      return res.status(200).json(bussesWithNoOperator);
    }

    return res.status(200).json(busses);
  }

  static async getBusById(busId, res) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    const bus = await Bus.findOne({
      where: { busId, status: "1" },
      include: [
        {
          model: BusType,
          attributes: { exclude: ["busTypeId"] },
        },
        {
          model: Routes,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status", "routeId"],
          },
        },
      ],
      attributes: ["busId", "permitId", "vehicleRegNo", "seatCount"],
    });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.status(200).json(bus);
  }

  static async updateBus(busId, updateData, res, userId) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    if (
      !updateData.vehicleRegNo &&
      !updateData.busTypeId &&
      !updateData.seatCount &&
      !updateData.routeId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bus = await Bus.findOne({ where: { busId, status: "1" } });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (userId === undefined || userId === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (bus.operatorId !== userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You are not the owner of this bus" });
    }

    const busExists = await Bus.findOne({
      where: {
        vehicleRegNo: updateData.vehicleRegNo,
        busId: { [Op.ne]: busId },
      },
    });

    if (busExists) {
      return res
        .status(400)
        .json({ message: "Vehicle Registration Number already in use" });
    }

    const routeExists = await Routes.findOne({
      where: { routeId: updateData.routeId, status: "1" },
    });

    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const busTypeExists = await BusType.findOne({
      where: { busTypeId: updateData.busTypeId },
    });

    if (!busTypeExists) {
      return res.status(404).json({ message: "Bus Type not found" });
    }

    const permitIdExists = await Bus.findOne({
      where: {
        permitId: updateData.permitId,
        status: "1",
        busId: { [Op.ne]: busId },
      },
    });

    if (permitIdExists) {
      return res.status(400).json({ message: "Permit ID already in use" });
    }

    if (updateData.seatCount < 0 || updateData.seatCount > 100) {
      return res
        .status(400)
        .json({ message: "Seat count must be between 0 and 100" });
    }

    const busData = {
      permitId: updateData.permitId || bus.permitId,
      vehicleRegNo: updateData.vehicleRegNo || bus.vehicleRegNo,
      busTypeId: updateData.busTypeId || bus.busTypeId,
      seatCount: updateData.seatCount || bus.seatCount,
      routeId: updateData.routeId || bus.routeId,
    };

    const updated = await bus.update(busData, { where: { busId } });

    const reconstructedBus = await Bus.findOne({
      where: { busId: updated.busId },
      include: [
        {
          model: BusType,
          attributes: { exclude: ["busTypeId"] },
        },
        {
          model: Routes,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status", "routeId"],
          },
        },
      ],
      attributes: ["busId", "permitId", "vehicleRegNo", "seatCount"],
    });

    return res.status(200).json({
      message: "Bus updated successfully",
      bus: reconstructedBus,
    });
  }

  static async deleteBus(busId, res, userId) {
    if (!busId) {
      return res.status(400).json({ message: "Bus ID is required" });
    }

    if (userId === undefined || userId === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bus = await Bus.findOne({ where: { busId, status: "1" } });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (bus.operatorId !== userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: You are not the owner of this bus" });
    }

    await bus.update(
      {
        status: "0",
      },
      { where: { busId } }
    );

    return res.status(200).json({
      message: "Bus deleted successfully",
    });
  }
}

module.exports = BusService;
