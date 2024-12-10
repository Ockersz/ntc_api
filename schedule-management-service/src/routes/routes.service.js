const Route = require("./models/routes.model");

class RouteService {
  static async createRoute(routeData) {
    return await Route.create(routeData);
  }

  static async getAllRoutes() {
    return await Route.findAll();
  }

  static async getRouteById(routeId) {
    return await Route.findByPk(routeId);
  }

  static async updateRoute(routeId, updateData) {
    const route = await Route.findByPk(routeId);
    if (!route) throw new Error("Route not found");
    return await route.update(updateData);
  }

  static async deleteRoute(routeId) {
    const route = await Route.findByPk(routeId);
    if (!route) throw new Error("Route not found");
    await route.destroy();
    return true;
  }
}

module.exports = RouteService;
