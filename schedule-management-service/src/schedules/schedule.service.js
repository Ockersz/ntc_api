const Schedule = require("./models/schedule.model");
const {
  ScheduleTemplate,
  ScheduleTemplateDetail,
} = require("../schedule-template/models/relations");
const moment = require("moment");
const sequelize = require("../config/database");

class ScheduleService {
  async getAllSchedules() {
    return await Schedule.findAll();
  }

  async getScheduleById(scheduleId) {
    return await Schedule.findByPk(scheduleId);
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
    console.log(outboundTemplates);
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
}

module.exports = new ScheduleService();
