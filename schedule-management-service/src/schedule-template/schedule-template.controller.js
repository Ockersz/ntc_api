const ScheduleTemplateService = require("./schedule-template.service");

class ScheduleTemplateController {
  static async createScheduleTemplate(req, res) {
    try {
      return await ScheduleTemplateService.createTemplateWithDetails(
        req.body,
        res
      );
    } catch (error) {
      res.status(500).json({
        message: "Error creating Schedule Template",
        error: error.message,
      });
    }
  }

  static async updateScheduleTemplate(req, res) {
    try {
      const templateId = req.params.templateId;
      const data = req.body;
      return await ScheduleTemplateService.updateTemplateWithDetails(
        templateId,
        data,
        res
      );
    } catch (error) {
      res.status(500).json({
        message: "Error updating Schedule Template",
        error: error.message,
      });
    }
  }

  static async deleteScheduleTemplate(req, res) {
    try {
      return await ScheduleTemplateService.deleteTemplate(
        req.params.templateId,
        res
      );
    } catch (error) {
      res.status(500).json({
        message: "Error deleting Schedule Template",
        error: error.message,
      });
    }
  }

  static async getScheduleTemplate(req, res) {
    try {
      return await ScheduleTemplateService.getTemplateWithDetails(
        req.params.templateId,
        res
      );
    } catch (error) {
      res.status(500).json({
        message: "Error fetching Schedule Template",
        error: error.message,
      });
    }
  }

  static async getAllScheduleTemplates(req, res) {
    try {
      return await ScheduleTemplateService.getAllTemplatesWithDetails(res);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching Schedule Templates",
        error: error.message,
      });
    }
  }
}

module.exports = ScheduleTemplateController;
