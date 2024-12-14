const ReservationService = require("./reservation.service");

class ReservationController {
  static async createReservation(req, res) {
    try {
      const reservation = req.body;
      const response = await ReservationService.createReservation(reservation);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ReservationController;
