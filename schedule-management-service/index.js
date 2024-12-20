const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const busRoutes = require("./src/bus/bus.routes");
const sequelize = require("./src/config/database");
const cityRoutes = require("./src/city/city.routes");
const routeRoutes = require("./src/routes/routes.routes");
const scheduleTemplateRoutes = require("./src/schedule-template/schedule-template.routes");
const scheduleRoutes = require("./src/schedules/schedule.routes");
const authMiddleware = require("./middleware/auth");

const app = express();
const port = 3001;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Schedule Management Service API",
      version: "1.0.0",
    },
    components: {
      schemas: {}, // Ensure this is defined
    },
  },
  apis: ["./src/**/*.js"], // Adjust the path to your API files
};

const swaggerDocs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(authMiddleware);
app.use("/buses", busRoutes);
app.use("/cities", cityRoutes);
app.use("/routes", routeRoutes);
app.use("/schedule-template", scheduleTemplateRoutes);
app.use("/schedules", scheduleRoutes);

//allow cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
