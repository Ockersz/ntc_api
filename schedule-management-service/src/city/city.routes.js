const express = require("express");
const CityController = require("./city.controller");

/**
 * @swagger
 * tags:
 *   - name: Cities
 *     description: API for cities in the system
 *
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: The city was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: The list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         description: Some server error
 *
 * /cities/{cityId}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The city ID
 *     responses:
 *       200:
 *         description: The city was successfully found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: The city was not found
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update a city
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The city ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: The city was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: The city was not found
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove a city
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The city ID
 *     responses:
 *       200:
 *         description: The city was successfully deleted
 *       404:
 *         description: The city was not found
 *       500:
 *         description: Some server error
 */

const router = express.Router();

router.post("/", CityController.createCity);
router.get("/", CityController.getAllCities);
router.get("/:cityId", CityController.getCityById);
router.put("/:cityId", CityController.updateCity);
router.delete("/:cityId", CityController.deleteCity);

module.exports = router;
