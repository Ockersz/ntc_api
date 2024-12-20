const express = require("express");
const ScheduleController = require("./schedule.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Schedule
 *     description: API for managing schedules in the system
 */

/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: List of all schedules
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Schedule"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 */

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Schedule details
 *       404:
 *         description: Schedule not found
 *   delete:
 *     summary: Delete a schedule by ID
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */

/**
 * @swagger
 * /schedule/{id}/seats:
 *   get:
 *     summary: Get available seats for a schedule
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Available seats
 *       404:
 *         description: Schedule not found
 */

router.get("/", ScheduleController.getAllSchedules);
router.get("/:id", ScheduleController.getScheduleById);
router.get("/:id/seats", ScheduleController.getSeatsAvailable);
router.post("/", ScheduleController.createSchedules);
router.delete("/:id", ScheduleController.deleteSchedule);

module.exports = router;
