const { RouteCity, Route, City } = require("../routes/models/relations");

class RouteCityService {
  static async assignCityToRoute(data, res) {
    if (!data.routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    if (!data.cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    if (!data.sequenceOrder) {
      return res.status(400).json({ message: "Sequence order is required" });
    }

    if (data.sequenceOrder < 0) {
      return res
        .status(400)
        .json({ message: "Sequence order must be greater than 0" });
    }

    const ifRouteExists = await Route.findOne({
      where: { routeId: data.routeId, status: 1 },
    });

    if (!ifRouteExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const ifSequenceOrderExists = await RouteCity.findOne({
      where: { routeId: data.routeId, sequenceOrder: data.sequenceOrder },
    });

    if (ifSequenceOrderExists) {
      return res.status(400).json({ message: "Sequence order already exists" });
    }

    const ifCityExistInRoute = await RouteCity.findOne({
      where: { routeId: data.routeId, cityId: data.cityId },
    });

    if (ifCityExistInRoute) {
      return res.status(400).json({ message: "City already exists in route" });
    }

    const constructedData = {
      routeId: data.routeId,
      cityId: data.cityId,
      sequenceOrder: data.sequenceOrder,
    };

    const createdRouteCity = await RouteCity.create(constructedData);

    return res.status(201).json({
      routeCityId: createdRouteCity.routeCityId,
      routeId: createdRouteCity.routeId,
      cityId: createdRouteCity.cityId,
      sequenceOrder: createdRouteCity.sequenceOrder,
    });
  }

  static async getRouteCities(routeId, res) {
    if (!routeId) {
      return res.status(400).json({ message: "Route ID is required" });
    }

    const routeCities = await RouteCity.findAll({
      where: { routeId },
      include: [
        {
          model: City,
          attributes: ["cityId", "name"],
        },
      ],
      attributes: ["cityId", "sequenceOrder"],
      order: [["sequenceOrder", "ASC"]],
    });

    if (!routeCities || routeCities.length === 0) {
      return res
        .status(404)
        .json({ message: "Cities not found for the route" });
    }

    const result = routeCities.map((routeCity) => ({
      cityId: routeCity.cityId,
      sequenceOrder: routeCity.sequenceOrder,
      cityName: routeCity.City ? routeCity.City.name : null,
    }));

    return res.status(200).json(result);
  }

  static async updateSequence(cityId, routeId, body, res) {
    const sequenceOrder = body.sequenceOrder;
    if (!cityId || !routeId) {
      return res
        .status(400)
        .json({ message: "City ID and Route ID are required" });
    }
    if (!sequenceOrder) {
      return res.status(400).json({ message: "Sequence order is required" });
    }

    if (sequenceOrder < 0) {
      return res
        .status(400)
        .json({ message: "Sequence order must be greater than 0" });
    }

    const routeExists = await Route.findOne({
      where: { routeId, status: 1 },
    });

    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const cityExists = await City.findOne({
      where: { cityId },
    });

    if (!cityExists) {
      return res.status(404).json({ message: "City not found" });
    }

    const cityExistsInRoute = await RouteCity.findOne({
      where: { routeId, cityId },
    });

    if (!cityExistsInRoute) {
      return res.status(404).json({ message: "City not found in route" });
    }

    const sequenceOrderExists = await RouteCity.findOne({
      where: { routeId, sequenceOrder },
    });

    if (sequenceOrderExists) {
      return res.status(400).json({ message: "Sequence order already exists" });
    }

    const updated = await RouteCity.update(
      { sequenceOrder },
      { where: { routeId, cityId } }
    );

    return res.status(200).json({
      message: "Sequence order updated successfully",
      routeCity: {
        routeId: routeId,
        cityId: cityId,
        sequenceOrder: sequenceOrder,
      },
    });
  }

  static async deleteRouteCity(cityId, routeId, res) {
    if (!cityId || !routeId) {
      return res
        .status(400)
        .json({ message: "City ID and Route ID are required" });
    }

    const routeExists = await Route.findOne({
      where: { routeId, status: 1 },
    });

    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const cityExists = await City.findOne({
      where: { cityId },
    });

    if (!cityExists) {
      return res.status(404).json({ message: "City not found" });
    }

    const cityExistsInRoute = await RouteCity.findOne({
      where: { routeId, cityId },
    });

    if (!cityExistsInRoute) {
      return res.status(404).json({ message: "City not found in route" });
    }

    const deleted = await RouteCity.destroy({ where: { routeId, cityId } });

    return res.status(200).json({ message: "City removed from route" });
  }
}

module.exports = RouteCityService;
