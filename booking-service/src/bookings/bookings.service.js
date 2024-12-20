const Bookings = require("./models/bookings.model");
const Reservation = require("../reservations/models/reservation.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmailToQueue = require("./emailQueue");

class BookingService {
  static async getAllBookings(nic) {
    return await Bookings.findAll({
      where: { nicNo: nic },
    });
  }

  static async createBooking(booking, token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.reservationId) {
      throw new Error("Invalid reservation token");
    }

    // Validate seat count
    if (
      booking.seatCount <= 0 ||
      booking.seatCount > Number(process.env.MAX_RESERVATION_PER_USER)
    ) {
      throw new Error("Invalid seat count");
    }
    booking.reservationId = payload.reservationId;
    booking.ticketPrice = payload.ticketPrice;

    const reservation = await Reservation.findByPk(payload.reservationId);

    if (!reservation) {
      throw new Error("Invalid reservation ID");
    }

    if (reservation.status !== "H") {
      throw new Error("Reservation is not in the hold status");
    }

    const transaction = await Bookings.sequelize.transaction();

    try {
      reservation.status = "B";
      booking.scheduleId = reservation.scheduleId;
      await reservation.save({ transaction });

      const newBooking = await Bookings.create(booking, { transaction });

      await transaction.commit();
      this.sendBookingSuccessEmail(newBooking);
      return newBooking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async sendBookingSuccessEmail(booking) {
    // Send email to the user
    const subject = "Booking Confirmation";
    const body = `Your booking has been confirmed. Your booking Reference ID is ${booking.id}.`;
    const recipient = booking.email;

    sendEmailToQueue(subject, body, recipient);
  }
}

module.exports = BookingService;
