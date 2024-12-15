const express = require("express");
const ReservationController = require("./reservation.controller");

const router = express.Router();

router.get("/booked-seats", ReservationController.calculateAvailableSeats);
router.post("/", ReservationController.createReservation);

module.exports = router;
