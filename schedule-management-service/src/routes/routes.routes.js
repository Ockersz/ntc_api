const express = require("express");
const RouteController = require("./routes.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Routes
 *     description: API for routes in the system
 */

/**
 * @swagger
 * paths:
 *   /:
 *     post:
 *       summary: Create a new route
 *       operationId: createRoute
 *       tags: [Routes]
 *       responses:
 *         '200':
 *           description: Route created successfully
 *     get:
 *       summary: Get all routes
 *       operationId: getAllRoutes
 *       tags: [Routes]
 *       responses:
 *         '200':
 *           description: A list of routes
 *   /{routeId}:
 *     get:
 *       summary: Get a route by ID
 *       operationId: getRouteById
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Route details
 *     put:
 *       summary: Update a route by ID
 *       operationId: updateRoute
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Route updated successfully
 *     delete:
 *       summary: Delete a route by ID
 *       operationId: deleteRoute
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Route deleted successfully
 *   /{routeId}/cities:
 *     post:
 *       summary: Assign a city to a route
 *       operationId: assignCityToRoute
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: City assigned to route successfully
 *     get:
 *       summary: Get cities for a route
 *       operationId: getRouteCities
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of cities for the route
 *   /{routeId}/cities/{routeCityId}:
 *     put:
 *       summary: Update city sequence in a route
 *       operationId: updateCitySequence
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *         - name: routeCityId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: City sequence updated successfully
 *     delete:
 *       summary: Remove a city from a route
 *       operationId: removeCityFromRoute
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *         - name: routeCityId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: City removed from route successfully
 *   /{routeId}/buses:
 *     get:
 *       summary: Get buses for a route
 *       operationId: getRouteBuses
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of buses for the route
 *   /{routeId}/schedule-templates:
 *     get:
 *       summary: Get schedule templates for a route
 *       operationId: getRouteScheduleTemplates
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of schedule templates for the route
 *   /{routeId}/schedules:
 *     get:
 *       summary: Get schedules for a route
 *       operationId: getRouteSchedules
 *       tags: [Routes]
 *       parameters:
 *         - name: routeId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of schedules for the route
 */

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

// Nested route for buses
router.get("/:routeId/buses", RouteController.getRouteBuses);
router.get(
  "/:routeId/schedule-templates",
  RouteController.getRouteScheduleTemplates
);
router.get("/:routeId/schedules", RouteController.getRouteSchedules);

module.exports = router;
