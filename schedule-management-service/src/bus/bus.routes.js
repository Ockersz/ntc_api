const express = require("express");
const BusController = require("./bus.controller");

/**
 * @swagger
 * tags:
 *  name: Buses
 *  description: API for buses in the system
 * /buses:
 *  post:
 *      summary: Create a new bus
 *      tags: [Buses]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Bus'
 *      responses:
 *          200:
 *              description: The bus was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bus'
 *          500:
 *              description: Some server error
 *  get:
 *      summary: Get all buses
 *      tags: [Buses]
 *      responses:
 *          200:
 *              description: The list of buses
 *              content:
 *                  application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Bus'
 *          500:
 *              description: Some server error
 * /buses/{busId}:
 *  get:
 *      summary: Get a bus by ID
 *      tags: [Buses]
 *      parameters:
 *          - in: path
 *            name: busId
 *            schema:
 *              type: integer
 *            required: true
 *            description: The bus ID
 *      responses:
 *          200:
 *              description: The bus was successfully found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Bus'
 *          404:
 *              description: The bus was not found
 *          500:
 *              description: Some server error
 *  put:
 *      summary: Update a bus by ID
 *      tags: [Buses]
 *      parameters:
 *          - in: path
 *            name: busId
 *            schema:
 *              type: integer
 *            required: true
 *            description: The bus ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Bus'
 *          responses:
 *              200:
 *                  description: The bus was successfully updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Bus'
 *              404:
 *                  description: The bus was not found
 *              500:
 *                  description: Some server error
 */

const router = express.Router();

router.post("/", BusController.createBus);
router.get("/", BusController.getAllBuses);
router.get("/:busId", BusController.getBusById);
router.put("/:busId", BusController.updateBus);
router.delete("/:busId", BusController.deleteBus);

module.exports = router;
