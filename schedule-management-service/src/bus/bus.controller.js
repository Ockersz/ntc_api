const BusService = require("./bus.service");

class BusController {
  static async createBus(req, res) {
    try {
      const userId = req.user.sub;
      return await BusService.createBus(req.body, userId, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllBuses(req, res) {
    try {
      const userId = req.user.sub;
      return await BusService.getAllBuses(userId, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBusById(req, res) {
    try {
      const userId = req.user.sub;
      return await BusService.getBusById(req.params.busId, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBusByVehicleRegNo(req, res) {
    try {
      return await BusService.getBusByVehicleRegNo(
        req.params.vehicleRegNo,
        res
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateBus(req, res) {
    try {
      const userId = req.user.sub;
      return await BusService.updateBus(
        req.params.busId,
        req.body,
        res,
        userId
      );
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteBus(req, res) {
    try {
      const userId = req.user.sub;
      return await BusService.deleteBus(req.params.busId, res, userId);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = BusController;
