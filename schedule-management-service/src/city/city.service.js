const City = require("./models/city.model");

class CityService {
  static async createCity(cityData) {
    return await City.create(cityData);
  }

  static async getAllCities() {
    return await City.findAll();
  }

  static async getCityById(cityId) {
    return await City.findByPk(cityId);
  }

  static async updateCity(cityId, updateData) {
    const city = await City.findByPk(cityId);
    if (!city) throw new Error("City not found");
    return await city.update(updateData);
  }

  static async deleteCity(cityId) {
    const city = await City.findByPk(cityId);
    if (!city) throw new Error("City not found");
    await city.destroy();
    return true;
  }
}

module.exports = CityService;
