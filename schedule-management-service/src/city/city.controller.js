const CityService = require("./city.service");

class CityController {
  static async createCity(req, res) {
    try {
      return await CityService.createCity(req.body, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllCities(req, res) {
    try {
      const cities = await CityService.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCityById(req, res) {
    try {
      return await CityService.getCityById(req.params.cityId, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCity(req, res) {
    try {
      return await CityService.updateCity(req.params.cityId, req.body, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteCity(req, res) {
    try {
      return await CityService.deleteCity(req.params.cityId, res);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = CityController;
