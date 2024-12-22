const { Op } = require("sequelize");
const {
  ScheduleTemplate,
  ScheduleTemplateDetail,
  Bus,
  Route,
} = require("./models/relations");

class ScheduleTemplateService {
  static async createTemplateWithDetails(data, res) {
    const {
      routeId,
      name,
      recurrencePattern,
      startDate,
      endDate,
      details,
      direction,
    } = data;

    if (
      !routeId ||
      !name ||
      !recurrencePattern ||
      !startDate ||
      !endDate ||
      !details ||
      !direction
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const routeExists = await Route.findOne({
      where: {
        routeId,
        status: 1,
      },
    });

    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const scheduleTemplateExists = await ScheduleTemplate.findOne({
      where: {
        routeId,
        direction,
        recurrencePattern,
        status: 1,
      },
    });

    if (scheduleTemplateExists) {
      return res.status(409).json({ message: "Template already exists" });
    }

    const ifAllBusExists = await Bus.findAll({
      where: {
        busId: { [Op.in]: details.map((detail) => detail.busId) },
        status: 1,
      },
    });

    if (ifAllBusExists.length !== details.length) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const transaction = await ScheduleTemplate.sequelize.transaction();
    try {
      const template = await ScheduleTemplate.create(
        {
          routeId,
          name,
          recurrencePattern,
          startDate,
          endDate,
          direction,
        },
        { transaction }
      );

      const detailsWithTemplateId = details.map((detail) => ({
        ...detail,
        templateId: template.templateId,
      }));

      const templates = await ScheduleTemplateDetail.bulkCreate(
        detailsWithTemplateId,
        { transaction }
      );

      await transaction.commit();
      return this.getTemplateWithDetails(template.templateId, res);
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        message: "Error creating Schedule Template",
        error: error.message,
      });
    }
  }

  static async updateTemplateWithDetails(templateId, data, res) {
    const { name, recurrencePattern, startDate, endDate, details } = data;

    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    if (!name && !recurrencePattern && !startDate && !endDate && !details) {
      return res
        .status(400)
        .json({ message: "Please provide at least one field to update" });
    }

    const template = await ScheduleTemplate.findOne({
      where: {
        templateId,
        status: 1,
      },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const scheduleTemplateExists = await ScheduleTemplate.findOne({
      where: {
        templateId: { [Op.ne]: templateId },
        routeId: template.routeId,
        direction,
        recurrencePattern,
        status: 1,
      },
    });

    if (scheduleTemplateExists) {
      return res.status(409).json({
        message: "Another template already exists with the same details",
      });
    }

    const transaction = await ScheduleTemplate.sequelize.transaction();

    try {
      await ScheduleTemplate.update(
        {
          name: name || template.name,
          recurrencePattern: recurrencePattern || template.recurrencePattern,
          startDate: startDate || template.startDate,
          endDate: endDate || template.endDate,
        },
        { where: { templateId } },
        { transaction }
      );

      if (details) {
        await ScheduleTemplateDetail.destroy({ where: { templateId } });
        const detailsWithTemplateId = details.map((detail) => ({
          ...detail,
          templateId,
        }));
        await ScheduleTemplateDetail.bulkCreate(detailsWithTemplateId);
      }
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        message: "Error updating Schedule Template",
        error: error.message,
      });
    }
  }

  static async deleteTemplate(templateId, res) {
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const template = await ScheduleTemplate.findOne({
      where: {
        templateId,
        status: 1,
      },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    await template.update({ status: 0 });
    return res.status(200).json({ message: "Template deleted successfully" });
  }

  static async getTemplateWithDetails(templateId, res) {
    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    const template = await ScheduleTemplate.findOne({
      where: {
        templateId,
        status: 1,
      },
      include: [
        {
          model: ScheduleTemplateDetail,
          attributes: {
            exclude: ["status", "createdAt", "updatedAt", "templateId"],
          },
          include: [
            {
              model: Bus,
              attributes: {
                exclude: [
                  "status",
                  "createdAt",
                  "updatedAt",
                  "routeId",
                  "operatorId",
                ],
              },
            },
          ],
        },
      ],
      attributes: { exclude: ["status", "createdAt", "updatedAt"] },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.status(200).json(template);
  }

  static async getAllTemplatesWithDetails(res) {
    const templates = await ScheduleTemplate.findAll({
      where: {
        status: 1,
      },
      include: [
        {
          model: ScheduleTemplateDetail,
          attributes: {
            exclude: ["status", "createdAt", "updatedAt", "templateId"],
          },
          include: [
            {
              model: Bus,
              attributes: {
                exclude: [
                  "status",
                  "createdAt",
                  "updatedAt",
                  "routeId",
                  "operatorId",
                ],
              },
            },
          ],
        },
      ],
      attributes: { exclude: ["status", "createdAt", "updatedAt"] },
    });

    if (!templates || templates.length === 0) {
      return res.status(404).json({ message: "Templates not found" });
    }

    return res.status(200).json(templates);
  }
}

module.exports = ScheduleTemplateService;
