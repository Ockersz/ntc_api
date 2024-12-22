const BusService = require("./bus.service");

class BusController {
  static async createBus(req, res) {
    try {
      const userId = req.user.sub;
      const bus = await BusService.createBus(req.body, userId);
      res.status(201).json(bus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllBuses(req, res) {
    try {
      const buses = await BusService.getAllBuses();
      res.status(200).json(buses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBusById(req, res) {
    try {
      const bus = await BusService.getBusById(req.params.busId);
      if (!bus) return res.status(404).json({ message: "Bus not found" });
      res.status(200).json(bus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBusByVehicleRegNo(req, res) {
    try {
      const bus = await BusService.getBusByVehicleRegNo(
        req.params.vehicleRegNo
      );
      if (!bus) return res.status(404).json({ message: "Bus not found" });
      res.status(200).json(bus);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateBus(req, res) {
    try {
      const updatedBus = await BusService.updateBus(req.params.busId, req.body);
      res.status(200).json(updatedBus);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteBus(req, res) {
    try {
      await BusService.deleteBus(req.params.busId);
      res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = BusController;
