const ScheduleService = require("./schedule.service");

class ScheduleController {
  async getAllSchedules(req, res) {
    try {
      const schedules = await ScheduleService.getAllSchedules();
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedules", error });
    }
  }

  async getScheduleById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await ScheduleService.getScheduleById(id);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedule", error });
    }
  }

  async createSchedules(req, res) {
    try {
      const { routeId, dateRange, templateIds } = req.body;
      const result = await ScheduleService.processSchedule(
        routeId,
        dateRange,
        templateIds
      );
      res.status(201).json(result);
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
}

module.exports = new ScheduleController();