const express = require("express");
const CityController = require("./city.controller");

const router = express.Router();

router.post("/", CityController.createCity);
router.get("/", CityController.getAllCities);
router.get("/:cityId", CityController.getCityById);
router.put("/:cityId", CityController.updateCity);
router.delete("/:cityId", CityController.deleteCity);

module.exports = router;
