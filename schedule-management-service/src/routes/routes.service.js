const { Route } = require("./models/relations");
const Bus = require("../bus/models/bus.model");
const ScheduleTemplate = require("../schedule-template/models/schedule-template.model");
const Schedule = require("../schedules/models/schedule.model");
const { Op } = require("sequelize");

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

  static async getRouteBuses(routeId) {
    const buses = await Bus.findAll({
      where: { routeId: routeId },
    });
    if (!buses || buses.length === 0) throw new Error("Buses not found");
    return buses;
  }

  static async getRouteScheduleTemplates(routeId) {
    const route = await Route.findByPk(routeId, {
      include: [ScheduleTemplate],
    });
    if (!route) throw new Error("Route not found");
    return route;
  }

  static async getRouteSchedules(routeId, fromDate, toDate) {
    if (fromDate && toDate) {
      return await Route.findByPk(routeId, {
        include: [
          {
            model: Schedule,
            where: {
              startTime: {
                [Op.between]: [fromDate, toDate],
              },
            },
          },
        ],
      });
    } else {
      const route = await Route.findByPk(routeId, {
        include: [Schedule],
      });
      if (!route) throw new Error("Route not found");
      return route;
    }
  }
}

module.exports = RouteService;
