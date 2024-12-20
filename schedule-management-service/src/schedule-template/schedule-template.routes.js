const express = require("express");
const router = express.Router();
const scheduleTemplateController = require("./schedule-template.controller");

/**
 * @swagger
 * tags:
 *   - name: Schedule Templates
 *     description: API for managing schedule templates in the system
 */

/**
 * @swagger
 * /schedule-template:
 *   post:
 *     tags:
 *       - Schedule Templates
 *     summary: Create a new schedule template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Morning Shift"
 *               description:
 *                 type: string
 *                 example: "Template for morning shift"
 *     responses:
 *       201:
 *         description: Schedule template created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", scheduleTemplateController.createScheduleTemplate);

/**
 * @swagger
 * /schedule-template/{templateId}:
 *   put:
 *     tags:
 *       - Schedule Templates
 *     summary: Update an existing schedule template
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Morning Shift"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Schedule template updated successfully
 *       404:
 *         description: Schedule template not found
 */
router.put("/:templateId", scheduleTemplateController.updateScheduleTemplate);

/**
 * @swagger
 * /schedule-template/{templateId}:
 *   delete:
 *     tags:
 *       - Schedule Templates
 *     summary: Delete a schedule template
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule template to delete
 *     responses:
 *       200:
 *         description: Schedule template deleted successfully
 *       404:
 *         description: Schedule template not found
 */
router.delete(
  "/:templateId",
  scheduleTemplateController.deleteScheduleTemplate
);

/**
 * @swagger
 * /schedule-template/{templateId}:
 *   get:
 *     tags:
 *       - Schedule Templates
 *     summary: Get a schedule template by ID
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the schedule template to retrieve
 *     responses:
 *       200:
 *         description: Schedule template retrieved successfully
 *       404:
 *         description: Schedule template not found
 */
router.get("/:templateId", scheduleTemplateController.getScheduleTemplate);

/**
 * @swagger
 * /schedule-template:
 *   get:
 *     tags:
 *       - Schedule Templates
 *     summary: Get all schedule templates
 *     responses:
 *       200:
 *         description: List of schedule templates retrieved successfully
 */
router.get("/", scheduleTemplateController.getAllScheduleTemplates);

module.exports = router;
