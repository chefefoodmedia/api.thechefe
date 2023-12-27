const mongoose = require("mongoose");

const EmailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  htmlTemplate: {
    type: String,
    required: true,
  },
  textTemplate: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("EmailTemplate", EmailTemplateSchema);
