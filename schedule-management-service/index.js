const express = require("express");
const busRoutes = require("./src/bus/bus.routes");
const sequelize = require("./src/config/database");
const cityRoutes = require("./src/city/city.routes");
const routeRoutes = require("./src/routes/routes.routes");
const scheduleTemplateRoutes = require("./src/schedule-template/schedule-template.routes");
const authMiddleware = require("./middleware/auth");

const app = express();
const port = 3001;

app.use(express.json());
app.use(authMiddleware);
app.use("/buses", busRoutes);
app.use("/cities", cityRoutes);
app.use("/routes", routeRoutes);
app.use("/schedule-template", scheduleTemplateRoutes);

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
