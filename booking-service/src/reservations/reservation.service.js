const axios = require("axios");
const Reservation = require("./models/reservation.model");
const Booking = require("../bookings/models/bookings.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendMessageToSQS } = require("./reservationQueue");

class ReservationService {
  // Base URL for schedule microservice
  static BASE_URL = process.env.BASE_URL;

  // Generate a short-lived token for inter-service communication
  static generateServiceToken() {
    return jwt.sign(
      { service: process.env.TRUSTED_SERVICE_NAME },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  /**
   * Creates a new reservation if sufficient seats are available.
   * @param {Object} reservation - Reservation details (scheduleId, seatCount, etc.)
   * @throws Will throw an error if seat count is invalid or insufficient availability.
   */
  static async createReservation(reservation, res) {
    if (!reservation.scheduleId || !reservation.seatCount) {
      return res.status(400).json({
        error: "Invalid request: scheduleId and seatCount are required",
      });
    }

    // Validate seat count
    if (
      reservation.seatCount <= 0 ||
      reservation.seatCount > Number(process.env.MAX_RESERVATION_PER_USER)
    ) {
      return res.status(400).json({
        error: `Invalid seat count: seatCount should be between 1 and ${process.env.MAX_RESERVATION_PER_USER}`,
      });
    }

    // Fetch schedule details
    const scheduleDetails = await this.fetchScheduleDetails(
      reservation.scheduleId
    );

    if (!scheduleDetails) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Calculate available seats
    const availableSeats = this.calculateAvailableSeats(
      reservation.scheduleId,
      scheduleDetails?.Bus?.seatCount
    );

    // Check if requested seats are available
    if (availableSeats < reservation.seatCount) {
      return res.status(400).json({
        error: "Insufficient seats available",
        availableSeats,
      });
    }

    // Create reservation
    const transaction = await Reservation.sequelize.transaction();
    try {
      const reserve = await Reservation.create(reservation, { transaction });
      const reserveToken = jwt.sign(
        {
          reservationId: reserve.reservationId,
          ticketPrice: scheduleDetails?.Bus?.bus_type?.price,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );
      reserve.dataValues.token = reserveToken;
      reserve.dataValues.ticketPrice = scheduleDetails?.Bus?.bus_type?.price;
      sendMessageToSQS(reserve);
      await transaction.commit();
      return res.status(201).json({
        reservationToken: reserveToken,
        seatCount: reserve.seatCount,
        ticketPrice: scheduleDetails?.Bus?.bus_type?.price,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating reservation:", error.message);
      return res
        .status(500)
        .json({ error: `Failed to create reservation ${error.message}` });
    }
  }

  /**
   * Fetches details of a schedule from the Schedule microservice.
   * @param {number} scheduleId - ID of the schedule
   * @returns {Object} Schedule details
   * @throws Will throw an error if the fetch fails.
   */
  static async fetchScheduleDetails(scheduleId) {
    try {
      const token = this.generateServiceToken();
      const response = await axios.get(
        `${this.BASE_URL}/schedules/${scheduleId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule details:", error.message);
      return error;
    }
  }

  /**
   * Calculates the number of available seats for a schedule.
   * @param {number} scheduleId - ID of the schedule
   * @param {number} busSeatCount - Total seats on the bus
   * @returns {number} Number of available seats
   * @throws Will throw an error if the fetch fails.
   */
  static async calculateAvailableSeats(
    scheduleId,
    busSeatCount = 0,
    res = null
  ) {
    try {
      // Fetch all bookings and reservations for the schedule
      const [bookings, reservations] = await Promise.all([
        Booking.findAll({ where: { scheduleId } }),
        Reservation.findAll({ where: { scheduleId, status: "H" } }),
      ]);

      if (bookings.length === 0 && reservations.length === 0 && res) {
        return res
          .status(404)
          .json({ error: "No bookings or reservations found" });
      }

      // Calculate total seats
      const totalBookedSeats = bookings.reduce(
        (acc, booking) => acc + booking.seatCount,
        0
      );

      const totalReservedSeats = reservations.reduce(
        (acc, reservation) => acc + reservation.seatCount,
        0
      );

      // Return available seats
      if (busSeatCount === 0 && res) {
        return res.status(200).json({ availableSeats: 0 });
      }

      return busSeatCount - (totalBookedSeats + totalReservedSeats);
    } catch (error) {
      if (res) {
        return res.status(500).json({ error: error.message });
      }
      return error;
    }
  }

  static async validateReservation(reservation) {
    try {
      const reservationDet = await Reservation.findByPk(
        reservation.reservationId
      );

      if (reservationDet.status === "H") {
        reservationDet.status = "R";
        await reservationDet.save();
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = ReservationService;
