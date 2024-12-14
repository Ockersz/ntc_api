const express = require("express");
const sequelize = require("./src/config/database");
const authMiddleware = require("./middleware/auth");
// const bookingRoutes = require("./src/bookings/bookings.routes");
const reservationRoutes = require("./src/reservations/reservation.routes");

const app = express();
const port = 3002;

app.use(express.json());
app.use(authMiddleware);
// app.use("/bookings", bookingRoutes);
app.use("/reservations", reservationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  //connect to database
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
});
