const City = require("./models/city.model");

class CityService {
  static async createCity(cityData, res) {
    if (!cityData.name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const exsist = await City.findOne({
      where: { name: cityData.name },
      attributes: ["name", "cityId"],
    });

    if (exsist) {
      return res.status(400).json({ message: "City already exsist" });
    }

    const transaction = await sequelize.transaction();
    try {
      const city = await City.create(cityData, { transaction });
      await transaction.commit();
      return res.status(201).json(city);
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllCities() {
    return await City.findAll({
      attributes: ["name", "cityId"],
    });
  }

  static async getCityById(cityId, res) {
    if (!cityId) {
      return res.status(400).json({ message: "City ID is required" });
    }

    const city = await City.findByPk(cityId, {
      attributes: ["name", "cityId"],
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
      where: { name: updateData.name, id: { [Op.ne]: cityId } },
    });

    if (cityExsist) {
      return res.status(400).json({ message: "City name already exsist" });
    }

    const cityData = {
      name: updateData.name,
    };

    const cityUpdated = await City.update(cityData, {
      where: { id: cityId },
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

    const city = await City.findByPk(cityId);

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    await city.destroy();
    return res.status(200).json({ message: "City deleted successfully" });
  }
}

module.exports = CityService;
