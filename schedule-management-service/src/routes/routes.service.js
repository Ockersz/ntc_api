const { Route, RouteCity, City } = require("./models/relations");
const { Bus, BusType } = require("../bus/models/relations");
const { ScheduleTemplate, Schedule } = require("../schedules/models/relations");
const { Op } = require("sequelize");

class RouteService {
  static async createRoute(routeData, res) {
    if (
      !routeData.routeName ||
      !routeData.estimatedTime ||
      !routeData.distance
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const routeExists = await Route.findOne({
      where: {
        [Op.and]: [
          Route.sequelize.where(
            Route.sequelize.fn(
              "REPLACE",
              Route.sequelize.fn("LOWER", Route.sequelize.col("routeName")),
              " ",
              ""
            ),
            routeData.routeName.toLowerCase().replace(/\s/g, "")
          ),
          { status: 1 },
        ],
      },
      attributes: ["routeName", "routeId"],
    });

    if (routeExists) {
      return res.status(400).json({ message: "Route already exists" });
    }

    const creatingRoute = {
      routeName: routeData.routeName,
      estimatedTime: routeData.estimatedTime,
      distance: routeData.distance,
    };

    const route = await Route.create(creatingRoute);
    const newRouteData = {
      routeId: route.routeId,
      routeName: route.routeName,
      estimatedTime: route.estimatedTime,
      distance: route.distance,
    };
    return res.status(201).json(newRouteData);
  }

  static async getAllRoutes(res) {
    const routes = await Route.findAll({
      include: [
        {
          model: RouteCity,
          attributes: { exclude: ["createdAt", "updatedAt", "status"] },
          include: [
            {
              model: City,
              attributes: {
                exclude: ["createdAt", "updatedAt", "status"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "status"],
      },
      where: { status: 1 },
    });

    if (!routes || routes.length === 0) {
      return res.status(404).json({ message: "Routes not found" });
    }

    return res.status(200).json(routes);
  }

  static async getRouteById(routeId, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const route = await Route.findOne({
      where: {
        routeId: routeId,
        status: 1,
      },
      include: [
        {
          model: RouteCity,
          attributes: { exclude: ["createdAt", "updatedAt", "status"] },
          include: [
            {
              model: City,
              attributes: {
                exclude: ["createdAt", "updatedAt", "status"],
              },
            },
          ],
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "status"],
      },
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    return res.status(200).json(route);
  }

  static async updateRoute(routeId, updateData, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    if (!updateData) {
      return res.status(400).json({ message: "Please provide data to update" });
    }

    const routeNameExists = await Route.findOne({
      where: {
        [Op.and]: [
          Route.sequelize.where(
            Route.sequelize.fn(
              "REPLACE",
              Route.sequelize.fn("LOWER", Route.sequelize.col("routeName")),
              " ",
              ""
            ),
            updateData.routeName.toLowerCase().replace(/\s/g, "")
          ),
          {
            routeId: { [Op.ne]: routeId },
            status: 1,
          },
        ],
      },
    });

    if (routeNameExists) {
      return res.status(400).json({ message: "Route name already exists" });
    }

    const route = await Route.findOne({
      where: {
        routeId: routeId,
        status: 1,
      },
    });
    if (!route) return res.status(404).json({ message: "Route not found" });

    const updatedData = {
      routeName: updateData.routeName || route.routeName,
      estimatedTime: updateData.estimatedTime || route.estimatedTime,
      distance: updateData.distance || route.distance,
    };

    const updated = await route.update(updatedData);

    return res.status(200).json({
      message: "Route updated successfully",
      route: {
        routeId: updated.routeId,
        routeName: updated.routeName,
        estimatedTime: updated.estimatedTime,
        distance: updated.distance,
      },
    });
  }

  static async deleteRoute(routeId, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const route = await Route.findOne({
      where: {
        routeId: routeId,
        status: 1,
      },
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const deleted = await route.update({ status: 0 });

    return res.status(200).json(deleted);
  }

  static async getRouteBuses(routeId, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const buses = await Bus.findAll({
      where: { routeId: routeId, status: "1" },
      attributes: {
        exclude: ["createdAt", "updatedAt", "status", "routeId", "operatorId"],
      },
      include: [
        {
          model: BusType,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (!buses || buses.length === 0) {
      return res.status(404).json({ message: "Buses not found" });
    }

    return buses;
  }

  static async getRouteScheduleTemplates(routeId, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const route = await Route.findOne({
      where: {
        routeId: routeId,
        status: 1,
      },
      include: [
        {
          model: ScheduleTemplate,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "status"],
      },
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    return res.status(200).json(route);
  }

  static async getRouteSchedules(routeId, fromDate, toDate, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const route = await Route.findOne({
      where: {
        routeId: routeId,
        status: 1,
      },
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (!fromDate || !toDate) {
      // Get all schedules for the route
      const schedules = await Schedule.findAll({
        where: { routeId: routeId, status: 1 },
        attributes: {
          exclude: ["createdAt", "updatedAt", "status"],
        },
        include: [
          {
            model: Bus,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status"],
            },
          },
          {
            model: Route,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status"],
            },
          },
          {
            model: ScheduleTemplate,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status"],
            },
          },
        ],
      });

      if (!schedules || schedules.length === 0) {
        return res.status(404).json({ message: "Schedules not found" });
      }

      return res.status(200).json(schedules);
    }

    const schedules = await Schedule.findAll({
      where: {
        routeId: routeId,
        startTime: {
          [Op.between]: [fromDate, toDate],
        },
        status: 1,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "status"],
      },
      include: [
        {
          model: Bus,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },
        {
          model: Route,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },
        {
          model: ScheduleTemplate,
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },
      ],
    });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: "Schedules not found" });
    }

    return res.status(200).json(schedules);
  }
}

module.exports = RouteService;
