const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const nodemailer = require("nodemailer");
const fs = require("fs");
const util = require("util");
const User = require("../models/User");
const EmailTemplate = require("../models/EmailTemplate");
const EmailSendHistory = require("../models/EmailSendHistory");

const noReplayTransport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: "no-reply@thechefe.com",
    pass: process.env.NO_REPLY_EMAIL_PASSWORD,
  },
});

const ceoTransport = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: "shedrack@thechefe.com",
    pass: process.env.CEO_EMAIL_PASSWORD,
  },
});

const options = { new: true, runValidators: true };

const sendSignUpEmail = async (userId) => {
  const user = await getUserById(userId);
  const templateDetails = await getEmailTemplateByName("Welcome");
  const htmlTemplate = await getHtmlTemplate(templateDetails, user);
  sendMail(templateDetails, user, htmlTemplate);
};

const sendCEOSignUpEmail = async (userId) => {
  const user = await getUserById(userId);
  const templateDetails = await getEmailTemplateByName("CEO-Welcome");
  const htmlTemplate = await getHtmlTemplate(templateDetails, user);
  sendCEOMail(templateDetails, user, htmlTemplate);
};

const sendForgotPasswordEmail = async (userId) => {
  const user = await getUserById(userId);
  const templateDetails = await getEmailTemplateByName("Forgot-OTP");
  const htmlTemplate = await getHtmlTemplate(templateDetails, user);
  sendMail(templateDetails, user, htmlTemplate);
};

//send email
const sendMail = async (templateDetails, user, body) => {
  const mailOptions = {
    from: templateDetails.from,
    to: user.email,
    subject: templateDetails.subject,
    html: body,
  };
  noReplayTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      saveEmailSendHistory(templateDetails, body, "Error", error.message, user);
    } else {
      saveEmailSendHistory(templateDetails, body, "Success", "", user);
    }
  });
};

//send email
const sendCEOMail = async (templateDetails, user, body) => {
  const mailOptions = {
    from: templateDetails.from,
    to: user.email,
    subject: templateDetails.subject,
    html: body,
  };
  ceoTransport.sendMail(mailOptions, function (error, info) {
    if (error) {
      saveEmailSendHistory(templateDetails, body, "Error", error.message, user);
    } else {
      saveEmailSendHistory(templateDetails, body, "Success", "", user);
    }
  });
};

//get email template by name
const getEmailTemplateByName = async (name) => {
  let templateDetails = await EmailTemplate.find({ name: name });
  return templateDetails[0];
};

//save email history
const saveEmailSendHistory = async (
  templateDetails,
  htmlTemplate,
  status,
  errorMessage,
  user
) => {
  const emailSendHistory = await EmailSendHistory.create({
    templatedId: templateDetails._id,
    to: user.email,
    from: templateDetails.from,
    subject: templateDetails.subject,
    htmlTemplate: htmlTemplate,
    status: status,
    errorMessage: errorMessage,
    sentAt: new Date(),
    user: user._id,
  });
  console.log(emailSendHistory);
};

//get user by id
const getUserById = async (id) => {
  return await User.findById(id);
};

//get html template as string from emailTemplate.htmlTemplate
const getHtmlTemplate = async (templateDetails, user) => {
  const readFile = util.promisify(fs.readFile);
  let htmlTemplate = await readFile(
    `./public/${templateDetails.htmlTemplate}`,
    "utf8"
  );
  htmlTemplate = htmlTemplate.replace(/###OTP/g, user.otp);
  htmlTemplate = htmlTemplate.replace(/###UserName/g, user.name);
  return htmlTemplate;
};

module.exports = {
  sendSignUpEmail,
  sendForgotPasswordEmail,
  sendCEOSignUpEmail,
};
