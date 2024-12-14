const express = require("express");
const ScheduleController = require("./schedule.controller");

const router = express.Router();

router.get("/", ScheduleController.getAllSchedules);
router.get("/:id", ScheduleController.getScheduleById);
router.get("/:id/seat-availabiltiy", ScheduleController.getSeatAvailability);
router.post("/", ScheduleController.createSchedules);
router.delete("/:id", ScheduleController.deleteSchedule);

module.exports = router;
