const RouteService = require("./routes.service");
const RouteCityService = require("./route_city.service");

class RouteController {
  static async createRoute(req, res) {
    try {
      const route = await RouteService.createRoute(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllRoutes(req, res) {
    try {
      const routes = await RouteService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRouteById(req, res) {
    try {
      const route = await RouteService.getRouteById(req.params.routeId);
      if (!route) return res.status(404).json({ message: "Route not found" });
      res.status(200).json(route);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateRoute(req, res) {
    try {
      const updatedRoute = await RouteService.updateRoute(
        req.params.routeId,
        req.body
      );
      res.status(200).json(updatedRoute);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteRoute(req, res) {
    try {
      await RouteService.deleteRoute(req.params.routeId);
      res.status(200).json({ message: "Route deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async assignCityToRoute(req, res) {
    try {
      const data = { ...req.body, routeId: req.params.routeId };
      const routeCity = await RouteCityService.assignCityToRoute(data);
      res.status(201).json(routeCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get cities for a route in order
  static async getRouteCities(req, res) {
    try {
      const routeCities = await RouteCityService.getRouteCities(
        req.params.routeId
      );
      res.status(200).json(routeCities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update the sequence order of a city in a route
  static async updateCitySequence(req, res) {
    try {
      const updatedRouteCity = await RouteCityService.updateSequence(
        req.params.routeCityId,
        req.body.sequenceOrder
      );
      res.status(200).json(updatedRouteCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Remove a city from a route
  static async removeCityFromRoute(req, res) {
    try {
      await RouteCityService.deleteRouteCity(req.params.routeCityId);
      res.status(200).json({ message: "City removed from route successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getRouteBuses(req, res) {
    try {
      const buses = await RouteService.getRouteBuses(req.params.routeId);
      res.status(200).json(buses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = RouteController;
