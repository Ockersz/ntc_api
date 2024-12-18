const {
  Schedule,
  Bus,
  Route,
  RouteCity,
  TicketPrices,
} = require("./models/relations");
const axios = require("axios");
const {
  ScheduleTemplate,
  ScheduleTemplateDetail,
} = require("../schedule-template/models/relations");
const moment = require("moment");
const sequelize = require("../config/database");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const BusType = require("../bus-type/models/bus-type.model");

class ScheduleService {
  generateServiceToken() {
    return jwt.sign(
      { service: process.env.TRUSTED_SERVICE_NAME },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
  }

  async getAllSchedules(fromCity, toCity, fromDate, toDate) {
    const include = [
      {
        model: Bus,
        include: [
          {
            model: BusType,
            //as: "", // Ensure alias matches the association
          },
        ],
        where: {}, // Add any Bus-specific filters if needed
      },
      {
        model: Route,
        include: [],
      },
    ];

    const where = {};

    if (fromCity) {
      include[1].include.push({
        model: RouteCity,
        where: { cityId: fromCity },
      });
    }

    if (toCity) {
      include[1].include.push({
        model: RouteCity,
        where: { cityId: toCity },
      });
    }

    if (fromDate && toDate) {
      where.startTime = {
        [sequelize.Op.between]: [fromDate, toDate],
      };
    }

    if (!fromCity && !toCity) {
      delete include[1].include;
    }

    if (!fromDate && !toDate) {
      delete where.startTime;
    }

    // Check if the city combination exists
    if (fromCity && toCity) {
      const cityCombinationExists = await RouteCity.findOne({
        where: { cityId: fromCity },
        include: [
          {
            model: Route,
            include: [
              {
                model: RouteCity,
                where: { cityId: toCity },
              },
            ],
          },
        ],
      });

      if (!cityCombinationExists) {
        return []; // Return an empty array if the city combination does not exist
      }
    }

    const data = await Schedule.findAll({
      include,
      where,
    });

    // {
    //   "scheduleId": 1,
    //   "routeId": 1,
    //   "busId": 10,
    //   "templateId": 1,
    //   "startTime": "2025-01-01T11:30:00.000Z",
    //   "endTime": "2025-01-01T13:30:00.000Z",
    //   "status": "1",
    //   "createdAt": "2024-12-12T17:53:27.000Z",
    //   "updatedAt": "2024-12-12T17:53:27.000Z",
    //   "Bus": {
    //     "busId": 10,
    //     "operatorId": null,
    //     "permitId": "9328",
    //     "vehicleRegNo": "ND-3252",
    //     "status": "1",
    //     "busTypeId": 4,
    //     "seatCount": 55,
    //     "routeId": 1,
    //     "createdAt": "2024-12-10T16:27:52.000Z",
    //     "updatedAt": "2024-12-19T01:14:26.000Z",
    //     "bus_type": {
    //       "busTypeId": 4,
    //       "type": "luxury",
    //       "price": "100.00"
    //     }
    //   },
    //   "Route": {
    //     "routeId": 1,
    //     "routeName": "120",
    //     "estimatedTime": "2hrs",
    //     "distance": "40.00",
    //     "createdAt": "2024-12-10T15:31:14.000Z",
    //     "updatedAt": "2024-12-10T15:31:14.000Z",
    //     "RouteCities": [
    //       {
    //         "routeCityId": 3,
    //         "routeId": 1,
    //         "cityId": 5,
    //         "sequenceOrder": 3,
    //         "createdAt": "2024-12-10T15:34:20.000Z",
    //         "updatedAt": "2024-12-10T15:34:20.000Z"
    //       }
    //     ]
    //   }
    // },

    //get the price and distance of the route and show the price per seat

    const schedules = data.map((schedule) => {
      const { Bus, Route } = schedule;
      const { bus_type } = Bus;

      let distance = 0;
      let price = 0;

      if (Route && bus_type) {
        price = Route.distance * bus_type.price;
      }

      return {
        scheduleId: schedule.scheduleId,
        routeId: Route.routeId,
        busId: Bus.busId,
        templateId: schedule.templateId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        status: schedule.status,
        perSeatPrice: price,
        bus: {
          busId: Bus.busId,
          permitId: Bus.permitId,
          vehicleRegNo: Bus.vehicleRegNo,
          status: Bus.status,
          busTypeId: Bus.busTypeId,
          seatCount: Bus.seatCount,
          busType: {
            busTypeId: bus_type.busTypeId,
            type: bus_type.type,
            price: bus_type.price,
          },
        },
        route: {
          routeId: Route.routeId,
          routeName: Route.routeName,
          estimatedTime: Route.estimatedTime,
          distance: distance,
        },
      };
    });

    return schedules;
  }

  async getScheduleById(scheduleId) {
    return await Schedule.findByPk(scheduleId, {
      include: [Bus, Route],
    });
  }

  async processSchedule(routeId, dateRange, templateIds) {
    const [startDate, endDate] = dateRange;

    // Validation: Ensure the date range is valid
    if (
      !moment(startDate).isValid() ||
      !moment(endDate).isValid() ||
      moment(startDate).isAfter(endDate)
    ) {
      throw new Error("Invalid date range provided.");
    }

    // Fetch the selected templates and their details
    const templates = await ScheduleTemplate.findAll({
      where: { routeId, templateId: templateIds },
      include: [{ model: ScheduleTemplateDetail }],
    });

    if (templates.length === 0) {
      throw new Error("No templates found for the selected route and IDs.");
    }

    // Separate templates into outbound and return
    const outboundTemplates = templates.filter(
      (template) => template.direction === "outbound"
    );
    const returnTemplates = templates.filter(
      (template) => template.direction === "return"
    );
    // Validation: Check for conflicting templates in each direction
    this.validateTemplateConflicts(outboundTemplates, startDate, endDate);
    this.validateTemplateConflicts(returnTemplates, startDate, endDate);

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
      return {
        message: "Schedules processed successfully.",
        count: schedule.length,
      };
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new Error("Error processing schedules.");
    }
  }

  async deleteSchedule(scheduleId) {
    return await Schedule.destroy({ where: { scheduleId } });
  }

  validateTemplateConflicts(templates, startDate, endDate) {
    if (!Array.isArray(templates)) {
      throw new Error("Templates must be an array.");
    }

    const busScheduleMap = new Map();

    templates.forEach((template) => {
      const recurrenceDates = this.generateRecurrenceDates(
        startDate,
        endDate,
        template.recurrencePattern
      );

      if (!Array.isArray(template.dataValues.scheduletemplatedetails)) {
        throw new Error("Template details must be an array.");
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
              throw new Error(
                `Conflict detected: Bus ID ${busId} has overlapping schedules on ${date}. Time ranges ${schedule.startTime}-${schedule.endTime} and ${startTime}-${endTime} conflict.`
              );
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

  async getSeatAvailability(scheduleId) {
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
        throw new Error("Schedule not found.");
      }

      const busSeats = schedule.Bus.seatCount;

      if (response.status === 200) {
        return busSeats - response.data.availableSeats;
      }
    } catch (error) {
      console.error("Error fetching schedule details:", error.message);
      throw new Error("Failed to fetch schedule details");
    }
  }
}

module.exports = new ScheduleService();
