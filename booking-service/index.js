const express = require("express");
const sequelize = require("./src/config/database");
const authMiddleware = require("./middleware/auth");
const bookingRoutes = require("./src/bookings/bookings.routes");
const reservationRoutes = require("./src/reservations/reservation.routes");

const app = express();
const port = 3002;

app.use(express.json());
app.use(authMiddleware);
app.use("/bookings", bookingRoutes);
app.use("/reservations", reservationRoutes);

//enable cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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
