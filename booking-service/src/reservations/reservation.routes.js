const express = require("express");
const ReservationController = require("./reservation.controller");

const router = express.Router();

router.post("/", ReservationController.createReservation);
router.get("/booked-seats", ReservationController.calculateAvailableSeats);

module.exports = router;
