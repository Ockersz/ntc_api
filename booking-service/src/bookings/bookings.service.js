const Bookings = require("./models/bookings.model");
const Reservation = require("../reservations/models/reservation.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmailToQueue = require("./emailQueue");

class BookingService {
  static async getAllBookings(nic, res) {
    if (!nic) {
      return res.status(400).json({ error: "NIC is required" });
    }

    const bookings = await Bookings.findAll({
      where: { nicNo: nic },
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    return res.status(200).json(bookings);
  }

  static async createBooking(booking, token, res) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload || !payload.reservationId) {
      return res.status(400).json({ error: "Invalid Reservation token" });
    }

    // Validate seat count
    if (
      booking.seatCount <= 0 ||
      booking.seatCount > Number(process.env.MAX_RESERVATION_PER_USER)
    ) {
      return res.status(400).json({
        error: `Seat count should be between 1 and ${process.env.MAX_RESERVATION_PER_USER}`,
      });
    }
    booking.reservationId = payload.reservationId;
    booking.ticketPrice = payload.ticketPrice;

    const reservation = await Reservation.findByPk(payload.reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    if (reservation.status !== "H") {
      return res
        .status(400)
        .json({ error: "Reservation already booked or does not exist" });
    }

    const transaction = await Bookings.sequelize.transaction();

    try {
      reservation.status = "B";
      booking.scheduleId = reservation.scheduleId;
      await reservation.save({ transaction });
      const totalAmount = booking.seatCount * booking.ticketPrice;
      booking.totalAmount = totalAmount;
      const newBooking = await Bookings.create(booking, { transaction });

      await transaction.commit();
      this.sendBookingSuccessEmail(newBooking);
      return newBooking;
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }

  static async sendBookingSuccessEmail(booking) {
    // Send email to the user
    const subject = "Booking Confirmation";
    const body = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    background-color: #f7f7f7;
                    padding: 10px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                }
                .content {
                    margin: 20px 0;
                }
                .footer {
                    background-color: #f7f7f7;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                }
                .highlight {
                    color: #007BFF;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Booking Confirmation</h1>
                </div>
                <div class="content">
                    <p>Dear <strong>${booking.name}</strong>,</p>
                    <p>We are pleased to inform you that your booking has been confirmed!</p>
                    <p>Your booking details are as follows:</p>
                    <ul>
                        <li><strong>Booking Reference ID:</strong> <span class="highlight">${booking.bookingId}</span></li>
                        <li><strong>NIC No:</strong> ${booking.nicNo}</li>
                    </ul>
                    <p>Thank you for choosing our service. If you have any questions, feel free to contact us.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    const recipient = booking.email;

    sendEmailToQueue(subject, body, recipient);
  }
}

module.exports = BookingService;
