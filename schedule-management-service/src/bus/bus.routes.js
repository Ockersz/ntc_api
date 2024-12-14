const express = require("express");
const BusController = require("./bus.controller");

const router = express.Router();

router.post("/", BusController.createBus);
router.get("/", BusController.getAllBuses);
router.get("/:busId", BusController.getBusById);
router.get("/vehicle/:vehicleRegNo", BusController.getBusByVehicleRegNo);
router.put("/:busId", BusController.updateBus);
router.delete("/:busId", BusController.deleteBus);

module.exports = router;
