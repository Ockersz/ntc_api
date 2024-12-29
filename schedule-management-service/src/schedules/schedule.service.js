const {
  Schedule,
  Bus,
  Route,
  ScheduleTemplate,
  ScheduleTemplateDetails,
  City,
  RouteCity,
} = require("./models/relations");
const axios = require("axios");
const moment = require("moment");
const sequelize = require("../config/database");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const BusType = require("../bus-type/models/bus-type.model");

class ScheduleService {
  generateServiceToken() {
    return jwt.sign(
      { service: process.env.TRUSTED_SERVICE_NAME },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  async getAllSchedules(fromCity, toCity, fromDate, toDate, res) {
    const whereClause = {};

    if (fromCity && toCity) {
      const fromCityDetails = await City.findOne({
        where: { cityId: fromCity },
      });
      if (!fromCityDetails) {
        return res.status(404).json({ message: "From city not found." });
      }

      const toCityDetails = await City.findOne({
        where: { cityId: toCity },
      });

      if (!toCityDetails) {
        return res.status(404).json({ message: "To city not found." });
      }

      // Get route city details which have both from and to city
      const routeCities = await sequelize.query(
        `
        SELECT 
            r1.routeId, 
            r1.cityId,
            r1.sequenceOrder
        FROM 
            route_city AS r1
        WHERE 
            r1.cityId = :fromCity

        AND r1.routeId IN (
            SELECT r2.routeId
            FROM route_city AS r2
            WHERE r2.cityId = :toCity
        )
        UNION ALL

        SELECT 
            r2.routeId, 
            r2.cityId,
            r2.sequenceOrder
        FROM 
            route_city AS r2
        WHERE 
            r2.cityId = :toCity

        AND r2.routeId IN (
            SELECT r1.routeId
            FROM route_city AS r1
            WHERE r1.cityId = :fromCity
        );
        `,
        {
          replacements: {
            fromCity: fromCityDetails.cityId,
            toCity: toCityDetails.cityId,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Determine the direction based on the sequence order
      let direction = "outbound";
      const routeCityMap = {};
      routeCities.forEach((routeCity) => {
        routeCityMap[routeCity.cityId] = routeCity.sequenceOrder;
      });

      if (
        routeCityMap[fromCityDetails.cityId] >
        routeCityMap[toCityDetails.cityId]
      ) {
        direction = "return";
      }

      whereClause.routeId = routeCities.map((routeCity) => routeCity.routeId);
      whereClause.direction = direction;
    }

    if (fromDate) {
      whereClause.startTime = { [Op.gte]: new Date(fromDate) };
    }
    if (toDate) {
      whereClause.endTime = { [Op.lte]: new Date(toDate) };
    }

    // Log the whereClause to debug
    console.log("whereClause:", whereClause);

    try {
      const schedules = await Schedule.findAll({
        where: whereClause,
        include: [
          {
            model: Bus,
            include: [
              {
                model: BusType,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
            attributes: {
              exclude: [
                "busTypeId",
                "createdAt",
                "updatedAt",
                "status",
                "operatorId",
              ],
            },
          },
          {
            model: Route,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status"],
            },
          },
        ],
        attributes: {
          exclude: ["templateId", "createdAt", "updatedAt"],
        },
      });

      return res.status(200).json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return res.status(500).json({
        message: "Error fetching schedules",
        error: error.message,
      });
    }
  }

  async getScheduleById(scheduleId, res) {
    try {
      const schedule = await Schedule.findOne({
        where: { scheduleId, status: 1 },
        include: [
          {
            model: Bus,
            include: [
              {
                model: BusType,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
            attributes: {
              exclude: [
                "busTypeId",
                "createdAt",
                "updatedAt",
                "status",
                "operatorId",
              ],
            },
          },
          {
            model: Route,
            attributes: {
              exclude: ["createdAt", "updatedAt", "status"],
            },
          },
        ],
        attributes: {
          exclude: ["templateId", "createdAt", "updatedAt"],
        },
      });

      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found." });
      }

      return res.status(200).json(schedule);
    } catch (error) {
      console.error("Error fetching schedule details:", error.message);
      return res
        .status(500)
        .json({ message: "Error fetching schedule details." });
    }
  }

  async processSchedule(routeId, dateRange, templateIds, res) {
    const [startDate, endDate] = dateRange;

    // Validation: Ensure the date range is valid
    if (
      !moment(startDate).isValid() ||
      !moment(endDate).isValid() ||
      moment(startDate).isAfter(endDate)
    ) {
      return res.status(400).json({ message: "Invalid date range." });
    }

    // Fetch the selected templates and their details
    const templates = await ScheduleTemplate.findAll({
      where: { routeId, templateId: templateIds },
      include: [{ model: ScheduleTemplateDetails }],
    });

    if (templates.length === 0) {
      return res.status(404).json({ message: "No templates found." });
    }

    // Separate templates into outbound and return
    const outboundTemplates = templates.filter(
      (template) => template.direction === "outbound"
    );
    const returnTemplates = templates.filter(
      (template) => template.direction === "return"
    );
    // Validation: Check for conflicting templates in each direction
    this.validateTemplateConflicts(outboundTemplates, startDate, endDate, res);
    this.validateTemplateConflicts(returnTemplates, startDate, endDate, res);

    // Prepare schedules
    const schedule = [];
    templates.forEach((template) => {
      const recurrenceDates = this.generateRecurrenceDates(
        startDate,
        endDate,
        template.recurrencePattern
      );

      template.dataValues.scheduletemplatedetails.forEach((detail) => {
        const dataVal = detail.dataValues;
        recurrenceDates.forEach((date) => {
          schedule.push({
            routeId,
            busId: dataVal.busId,
            templateId: template.dataValues.templateId,
            direction: template.dataValues.direction,
            startTime: `${date}T${dataVal.startTime}`,
            endTime: `${date}T${dataVal.endTime}`,
            status: 1,
          });
        });
      });
    });

    // Use transaction to ensure all schedules are saved or none
    const transaction = await sequelize.transaction();
    try {
      await Schedule.bulkCreate(schedule, {
        transaction,
      });

      await transaction.commit();
      return res.status(201).json({
        message: "Schedules processed successfully.",
        count: schedule.length,
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res
        .status(500)
        .json({ message: "Error processing schedules", error });
    }
  }

  async deleteSchedule(scheduleId) {
    return await Schedule.destroy({ where: { scheduleId } });
  }

  validateTemplateConflicts(templates, startDate, endDate, res) {
    if (!Array.isArray(templates)) {
      return res.status(400).json({ message: "Templates must be an array." });
    }

    const busScheduleMap = new Map();

    templates.forEach((template) => {
      const recurrenceDates = this.generateRecurrenceDates(
        startDate,
        endDate,
        template.recurrencePattern
      );

      if (!Array.isArray(template.dataValues.scheduletemplatedetails)) {
        return res.status(400).json({
          message: "Template details must be an array.",
        });
      }

      template.dataValues.scheduletemplatedetails.forEach((detail) => {
        const { busId, startTime, endTime } = detail.dataValues;

        recurrenceDates.forEach((date) => {
          const dayKey = `${busId}-${date}`;

          // Initialize the map for the bus on this day
          if (!busScheduleMap.has(dayKey)) {
            busScheduleMap.set(dayKey, []);
          }

          // Check for overlapping time ranges
          const existingSchedules = busScheduleMap.get(dayKey);
          for (const schedule of existingSchedules) {
            if (
              this.doTimeRangesOverlap(
                schedule.startTime,
                schedule.endTime,
                startTime,
                endTime
              )
            ) {
              return res.status(400).json({
                message: `Conflict detected: Bus ID ${busId} has overlapping schedules on ${date}. Time ranges ${schedule.startTime}-${schedule.endTime} and ${startTime}-${endTime} conflict.`,
              });
            }
          }

          // Add the new schedule to the map
          existingSchedules.push({ startTime, endTime });
        });
      });
    });
  }

  doTimeRangesOverlap(start1, end1, start2, end2) {
    const range1Start = new Date(`1970-01-01T${start1}`);
    const range1End = new Date(`1970-01-01T${end1}`);
    const range2Start = new Date(`1970-01-01T${start2}`);
    const range2End = new Date(`1970-01-01T${end2}`);

    return range1Start < range2End && range2Start < range1End;
  }

  generateRecurrenceDates(startDate, endDate, recurrencePattern) {
    const dates = [];
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(moment(endDate))) {
      const day = currentDate.date();
      const dayOfWeek = currentDate.day();

      if (
        recurrencePattern === "daily" ||
        (recurrencePattern === "even" && day % 2 === 0) ||
        (recurrencePattern === "odd" && day % 2 !== 0) ||
        (recurrencePattern === "weekly" && dayOfWeek === 0)
      ) {
        dates.push(currentDate.format("YYYY-MM-DD"));
      }

      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }

  async getSeatAvailability(scheduleId, res) {
    try {
      const token = this.generateServiceToken();
      const response = await axios.get(
        `${process.env.BOOKING_SERVICE_URL}/reservations/booked-seats?scheduleId=${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const schedule = await this.getScheduleById(scheduleId);

      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found." });
      }

      const busSeats = schedule.Bus.seatCount;

      if (response.status === 200) {
        return busSeats - response.data.availableSeats;
      }
    } catch (error) {
      console.error("Error fetching schedule details:", error.message);
      return res
        .status(500)
        .json({ message: "Error fetching schedule details." });
    }
  }
}

module.exports = new ScheduleService();
