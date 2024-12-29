const ReservationService = require("./reservation.service");

class ReservationController {
  static async createReservation(req, res) {
    try {
      const reservation = req.body;
      return await ReservationService.createReservation(reservation, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async calculateAvailableSeats(req, res) {
    try {
      const { scheduleId } = req.query;
      return await ReservationService.calculateAvailableSeats(
        scheduleId,
        null,
        res
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReservationController;
