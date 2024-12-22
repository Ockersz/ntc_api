const BookingService = require("./bookings.service");

class BookingController {
  static async getAllBookings(req, res) {
    try {
      const nic = req.params.nic;
      return await BookingService.getAllBookings(nic, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createBooking(req, res) {
    try {
      const booking = req.body;
      const token = req.headers.reservation_token;
      return await BookingService.createBooking(booking, token, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BookingController;
