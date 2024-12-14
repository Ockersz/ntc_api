const scheduleTemplateService = require("./schedule-template.service");

const createScheduleTemplate = async (req, res) => {
  try {
    const data = req.body;
    const result = await scheduleTemplateService.createTemplateWithDetails(
      data
    );
    res
      .status(201)
      .json({ message: "Schedule Template created successfully", result });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Schedule Template",
      error: error.message,
    });
  }
};

const updateScheduleTemplate = async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const data = req.body;
    const result = await scheduleTemplateService.updateTemplateWithDetails(
      templateId,
      data
    );
    res
      .status(200)
      .json({ message: "Schedule Template updated successfully", result });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Schedule Template",
      error: error.message,
    });
  }
};

const deleteScheduleTemplate = async (req, res) => {
  try {
    const templateId = req.params.templateId;
    await scheduleTemplateService.deleteTemplate(templateId);
    res.status(200).json({ message: "Schedule Template deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Schedule Template",
      error: error.message,
    });
  }
};

const getScheduleTemplate = async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const result = await scheduleTemplateService.getTemplateWithDetails(
      templateId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Schedule Template",
      error: error.message,
    });
  }
};

const getAllScheduleTemplates = async (req, res) => {
  try {
    const result = await scheduleTemplateService.getAllTemplatesWithDetails();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Schedule Templates",
      error: error.message,
    });
  }
};

module.exports = {
  createScheduleTemplate,
  updateScheduleTemplate,
  deleteScheduleTemplate,
  getScheduleTemplate,
  getAllScheduleTemplates,
};
