const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const EmailTemplate = require("../models/EmailTemplate");

const options = { new: true, runValidators: true };

const createEmailTemplate = async (req, res) => {
  const { name, subject, body } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  const emailTemplate = await EmailTemplate.create({
    name,
    subject,
    body,
    createdBy: id,
    createdByUserName: user.name,
    createdByImage: user.profileImage,
  });
  res.status(StatusCodes.CREATED).json({ emailTemplate });
  console.log(emailTemplate);
};
const getEmailTemplate = async (req, res) => {
  const { id, name } = req.body;
  //if name is passed then search by name and store in id
  if (name) {
    let templateDetails = await getEmailTemplateByName(name);
    id = templateDetails._id;
  }

  const emailTemplate = await EmailTemplate.find({ createdBy: id });
  if (!emailTemplate) throw new NotFoundError(`No emailTemplate with id ${id}`);
  res.status(StatusCodes.OK).json({ emailTemplate });
};

const getEmailTemplateByName = async (name) => {
  let templateDetails = await EmailTemplate.find({ name: name });
  return templateDetails[0];
};

module.exports = {
  createEmailTemplate,
  getEmailTemplate,
  getEmailTemplateByName,
};
