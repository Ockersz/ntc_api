const CityService = require("./city.service");

class CityController {
  static async createCity(req, res) {
    try {
      const city = await CityService.createCity(req.body);
      res.status(201).json(city);
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
      const city = await CityService.getCityById(req.params.cityId);
      if (!city) return res.status(404).json({ message: "City not found" });
      res.status(200).json(city);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCity(req, res) {
    try {
      const updatedCity = await CityService.updateCity(
        req.params.cityId,
        req.body
      );
      res.status(200).json(updatedCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteCity(req, res) {
    try {
      await CityService.deleteCity(req.params.cityId);
      res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = CityController;
