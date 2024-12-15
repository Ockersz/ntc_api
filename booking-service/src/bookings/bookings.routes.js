const BookingController = require("./bookings.controller");

const express = require("express");
const router = express.Router();

router.get("/:nic", BookingController.getAllBookings);
router.post("/", BookingController.createBooking);

module.exports = router;
