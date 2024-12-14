const BookingService = require("./bookings.service");

class BookingController {
  static async getAllBookings(req, res) {
    try {
      const nic = req.params.nic;
      const bookings = await BookingService.getAllBookings(nic);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createBooking(req, res) {
    try {
      const booking = req.body;
      const token = req.headers.reservation_token;
      const response = await BookingService.createBooking(booking, token);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BookingController;
