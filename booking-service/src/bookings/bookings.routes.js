const BookingController = require("./bookings.controller");

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: API for managing bookings in the system
 */

/**
 * @swagger
 * /bookings/{nic}:
 *   get:
 *     summary: Get all bookings of a user
 *     description: Retrieve all bookings associated with a user's NIC
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: nic
 *         required: true
 *         description: NIC of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Bookings'
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking for a user
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Bookings'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get("/:nic", BookingController.getAllBookings);
router.post("/", BookingController.createBooking);

module.exports = router;
