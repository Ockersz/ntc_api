const RouteCity = require("./models/route_city.model");

class RouteCityService {
  static async assignCityToRoute(data) {
    return await RouteCity.create(data);
  }

  static async getRouteCities(routeId) {
    return await RouteCity.findAll({
      where: { routeId },
      order: [["sequenceOrder", "ASC"]],
    });
  }

  static async updateSequence(routeCityId, sequenceOrder) {
    const routeCity = await RouteCity.findByPk(routeCityId);
    if (!routeCity) throw new Error("RouteCity not found");
    return await routeCity.update({ sequenceOrder });
  }

  static async deleteRouteCity(routeCityId) {
    const routeCity = await RouteCity.findByPk(routeCityId);
    if (!routeCity) throw new Error("RouteCity not found");
    await routeCity.destroy();
    return true;
  }
}

module.exports = RouteCityService;
