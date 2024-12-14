const Bookings = require("./models/bookings.model");

class BookingService {
  static async getAllBookings(nic) {
    return await Bookings.findAll({
      where: { nicNo: nic },
    });
  }

  static async createBooking(booking) {
    return await Bookings.create(booking);
  }
}
