/**
 * @swagger
 * /available-seats:
 *   get:
 *     summary: Calculate available seats
 *     description: Retrieve the number of available seats for a specific schedule.
 *     responses:
 *       200:
 *         description: Successfully retrieved available seats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableSeats:
 *                   type: integer
 *                   description: The number of available seats
 *       500:
 *         description: Internal server error
 *
 * /:
 *   post:
 *     summary: Create a new reservation
 *     description: Create a new reservation with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduleId:
 *                 type: integer
 *                 description: The id of the schedule
 *               nicNo:
 *                 type: string
 *                 description: The NIC number of the user
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               seatCount:
 *                 type: integer
 *                 description: The number of seats booked
 *               totalAmount:
 *                 type: number
 *                 description: The total amount of the booking
 *               status:
 *                 type: string
 *                 description: The status of the booking
 *               prefferedNotificationType:
 *                 type: string
 *                 description: The preferred notification type
 *             required:
 *               - scheduleId
 *               - nicNo
 *               - name
 *               - email
 *               - seatCount
 *               - status
 *               - prefferedNotificationType
 *     responses:
 *       201:
 *         description: Successfully created a new reservation
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const express = require("express");
const ReservationController = require("./reservation.controller");

const router = express.Router();

router.get("/available-seats", ReservationController.calculateAvailableSeats);
router.post("/", ReservationController.createReservation);

module.exports = router;
