const { Op } = require("sequelize");
const City = require("./models/city.model");

class CityService {
  static async createCity(cityData, res) {
    if (!cityData.name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const exsist = await City.findOne({
      where: City.sequelize.where(
        City.sequelize.fn(
          "REPLACE",
          City.sequelize.fn("LOWER", City.sequelize.col("name")),
          " ",
          ""
        ),
        cityData.name.toLowerCase().replace(/\s/g, "")
      ),
      attributes: ["name", "cityId"],
    });

    if (exsist) {
      return res.status(400).json({ message: "City already exsist" });
    }

    const transaction = await City.sequelize.transaction();
    try {
      const city = await City.create(cityData, { transaction });

      const newCityData = {
        name: city.name,
        cityId: city.cityId,
      };

      await transaction.commit();
      return res.status(201).json(newCityData);
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllCities() {
    return await City.findAll({
      attributes: ["name", "cityId"],
      where: {
        status: 1,
      },
    });
  }

  static async getCityById(cityId, res) {
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    const city = await City.findOne({
      attributes: ["name", "cityId"],
      where: {
        cityId: cityId,
        status: 1,
      },
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    return res.status(200).json(city);
  }

  static async updateCity(cityId, updateData, res) {
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    if (!updateData.name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const cityExsist = await City.findOne({
      where: {
        [Op.and]: [
          City.sequelize.where(
            City.sequelize.fn(
              "REPLACE",
              City.sequelize.fn("LOWER", City.sequelize.col("name")),
              " ",
              ""
            ),
            updateData.name.toLowerCase().replace(/\s/g, "")
          ),
          {
            cityId: {
              [Op.ne]: cityId,
            },
            status: 1,
          },
        ],
      },
    });

    if (cityExsist) {
      return res.status(400).json({ message: "City name already exsist" });
    }

    const cityData = {
      name: updateData.name,
    };

    const cityUpdated = await City.update(cityData, {
      where: { cityId: cityId },
    });

    if (!cityUpdated) {
      return res.status(404).json({ message: "City not found" });
    }

    return res.status(200).json({ message: "City updated successfully" });
  }

  static async deleteCity(cityId, res) {
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    const city = await City.findOne({
      where: {
        cityId: cityId,
        status: 1,
      },
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const cityDeleted = await City.update(
      { status: 0 },
      {
        where: { cityId: cityId },
      }
    );
    return res.status(200).json({ message: "City deleted successfully" });
  }
}

module.exports = CityService;
