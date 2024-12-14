// const ScheduleTemplateDetail = require("./models/schedule-template-detail.model");
// const ScheduleTemplate = require("./models/schedule-template.model");
const {
  ScheduleTemplate,
  ScheduleTemplateDetail,
} = require("./models/relations");
const createTemplateWithDetails = async (data) => {
  const {
    routeId,
    name,
    recurrencePattern,
    startDate,
    endDate,
    details,
    direction,
  } = data;

  const template = await ScheduleTemplate.create({
    routeId,
    name,
    recurrencePattern,
    startDate,
    endDate,
    direction,
  });

  const detailsWithTemplateId = details.map((detail) => ({
    ...detail,
    templateId: template.templateId,
  }));

  await ScheduleTemplateDetail.bulkCreate(detailsWithTemplateId);
  return template;
};

const updateTemplateWithDetails = async (templateId, data) => {
  const { name, recurrencePattern, startDate, endDate, details } = data;

  await ScheduleTemplate.update(
    { name, recurrencePattern, startDate, endDate },
    { where: { templateId } }
  );

  if (details) {
    await ScheduleTemplateDetail.destroy({ where: { templateId } });
    const detailsWithTemplateId = details.map((detail) => ({
      ...detail,
      templateId,
    }));
    await ScheduleTemplateDetail.bulkCreate(detailsWithTemplateId);
  }
};

const deleteTemplate = async (templateId) => {
  await ScheduleTemplate.update({ status: 0 }, { where: { templateId } });
};

const getTemplateWithDetails = async (templateId) => {
  return await ScheduleTemplate.findOne({
    where: { templateId },
    include: [ScheduleTemplateDetail],
  });
};

const getAllTemplatesWithDetails = async () => {
  return await ScheduleTemplate.findAll();
};

module.exports = {
  createTemplateWithDetails,
  updateTemplateWithDetails,
  deleteTemplate,
  getTemplateWithDetails,
  getAllTemplatesWithDetails,
};
