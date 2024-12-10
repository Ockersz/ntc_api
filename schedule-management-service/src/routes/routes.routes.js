const express = require("express");
const RouteController = require("./routes.controller");

const router = express.Router();

router.post("/", RouteController.createRoute);
router.get("/", RouteController.getAllRoutes);
router.get("/:routeId", RouteController.getRouteById);
router.put("/:routeId", RouteController.updateRoute);
router.delete("/:routeId", RouteController.deleteRoute);

// Nested route for cities
router.post("/:routeId/cities", RouteController.assignCityToRoute);
router.get("/:routeId/cities", RouteController.getRouteCities);
router.put("/:routeId/cities/:routeCityId", RouteController.updateCitySequence);
router.delete(
  "/:routeId/cities/:routeCityId",
  RouteController.removeCityFromRoute
);

module.exports = router;
