const RouteService = require("./routes.service");
const RouteCityService = require("./route_city.service");

class RouteController {
  static async createRoute(req, res) {
    try {
      return await RouteService.createRoute(req.body, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllRoutes(req, res) {
    try {
      return await RouteService.getAllRoutes(res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRouteById(req, res) {
    try {
      return await RouteService.getRouteById(req.params.routeId, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateRoute(req, res) {
    try {
      return await RouteService.updateRoute(req.params.routeId, req.body, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteRoute(req, res) {
    try {
      return await RouteService.deleteRoute(req.params.routeId, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async assignCityToRoute(req, res) {
    try {
      const data = { ...req.body, routeId: req.params.routeId };
      return await RouteCityService.assignCityToRoute(data, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get cities for a route in order
  static async getRouteCities(req, res) {
    try {
      const routeCities = await RouteCityService.getRouteCities(
        req.params.routeId,
        res
      );
      res.status(200).json(routeCities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update the sequence order of a city in a route
  static async updateCitySequence(req, res) {
    try {
      return await RouteCityService.updateSequence(
        req.params.cityId,
        req.params.routeId,
        req.body,
        res
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Remove a city from a route
  static async removeCityFromRoute(req, res) {
    try {
      return await RouteCityService.deleteRouteCity(
        req.params.cityId,
        req.params.routeId,
        res
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRouteBuses(req, res) {
    try {
      const buses = await RouteService.getRouteBuses(req.params.routeId, res);
      res.status(200).json(buses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRouteScheduleTemplates(req, res) {
    try {
      return await RouteService.getRouteScheduleTemplates(
        req.params.routeId,
        res
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getRouteSchedules(req, res) {
    try {
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;

      return await RouteService.getRouteSchedules(
        req.params.routeId,
        fromDate,
        toDate,
        res
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = RouteController;
