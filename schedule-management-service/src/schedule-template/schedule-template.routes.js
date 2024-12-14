const express = require("express");
const router = express.Router();
const scheduleTemplateController = require("./schedule-template.controller");

router.post("/", scheduleTemplateController.createScheduleTemplate);
router.put("/:templateId", scheduleTemplateController.updateScheduleTemplate);
router.delete(
  "/:templateId",
  scheduleTemplateController.deleteScheduleTemplate
);
router.get("/:templateId", scheduleTemplateController.getScheduleTemplate);
router.get("/", scheduleTemplateController.getAllScheduleTemplates);

module.exports = router;
