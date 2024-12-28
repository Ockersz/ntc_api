const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/database");
const authMiddleware = require("./middleware/auth");
const bookingRoutes = require("./src/bookings/bookings.routes");
const reservationRoutes = require("./src/reservations/reservation.routes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { pollMessagesFromSQS } = require("./src/reservations/reservationQueue");
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3002;

// const corsMiddleware = (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// };

app.use(express.json());
app.use(authMiddleware);
app.use("/bookings", bookingRoutes);
app.use("/reservations", reservationRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Service API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Bookings: {
          type: "object",
          properties: {
            bookingId: {
              type: "integer",
              description: "The auto-generated id of the booking",
            },
            scheduleId: {
              type: "integer",
              description: "The id of the schedule",
            },
            nicNo: {
              type: "string",
              description: "The NIC number of the user",
            },
            name: {
              type: "string",
              description: "The name of the user",
            },
            phoneNumber: {
              type: "string",
              description: "The phone number of the user",
            },
            email: {
              type: "string",
              description: "The email of the user",
            },
            seatCount: {
              type: "integer",
              description: "The number of seats booked",
            },
            totalAmount: {
              type: "number",
              description: "The total amount of the booking",
            },
            status: {
              type: "char",
              description: "The status of the booking",
            },
            prefferedNotificationType: {
              type: "string",
              description: "The preferred notification type",
            },
          },
          required: [
            "scheduleId",
            "nicNo",
            "name",
            "email",
            "seatCount",
            "status",
            "prefferedNotificationType",
          ],
          example: {
            scheduleId: 1,
            nicNo: "123456789V",
            name: "John Doe",
            phoneNumber: "0771234567",
            email: "user@exampl.com",
            seatCount: 2,
            totalAmount: 2000.0,
            status: "B",
            prefferedNotificationType: "Email",
          },
        },
        Reservations: {
          type: "object",
          properties: {
            reservationId: {
              type: "integer",
              description: "The auto-generated id of the reservation",
            },
            scheduleId: {
              type: "integer",
              description: "The id of the schedule",
            },
            seatCount: {
              type: "integer",
              description: "The number of seats reserved",
              maximum: 5,
            },
            status: {
              type: "char",
              description: "The status of the reservation",
              default: "H",
            },
          },
          required: ["scheduleId", "seatCount"],
          example: {
            scheduleId: 1,
            seatCount: 3,
          },
        },
      },
    },
  },
  apis: ["./src/**/*.js"],
};

const swaggerDocs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    try {
      await sequelize.authenticate();
      console.log("Connection retry has been established successfully.");
    } catch (retryErr) {
      console.error("Retry failed to connect to the database:", retryErr);
    }
  }
});
