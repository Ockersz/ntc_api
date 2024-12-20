const express = require("express");
const ReservationController = require("./reservation.controller");

const router = express.Router();

router.get("/available-seats", ReservationController.calculateAvailableSeats);
router.post("/", ReservationController.createReservation);

module.exports = router;
