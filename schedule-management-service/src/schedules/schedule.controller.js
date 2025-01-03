const ScheduleService = require("./schedule.service");

class ScheduleController {
  async getAllSchedules(req, res) {
    try {
      const { fromCity, toCity, fromDate, toDate } = req.query;
      return await ScheduleService.getAllSchedules(
        fromCity,
        toCity,
        fromDate,
        toDate,
        res
      );
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedules", error });
    }
  }

  async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      return await ScheduleService.getScheduleById(id, res);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedule", error });
    }
  }

  async createSchedules(req, res) {
    try {
      const { routeId, dateRange, templateIds } = req.body;
      return await ScheduleService.processSchedule(
        routeId,
        dateRange,
        templateIds,
        res
      );
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error processing schedules", error });
    }
  }

  async deleteSchedule(req, res) {
    try {
      const { id } = req.params;
      const result = await ScheduleService.deleteSchedule(id);
      if (!result) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  }

  async getSeatsAvailable(req, res) {
    try {
      const { id } = req.params;
      return await ScheduleService.getSeatAvailability(id, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching available seats", error });
    }
  }
}

module.exports = new ScheduleController();
