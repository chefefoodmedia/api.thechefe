const mongoose = require("mongoose");

const EmailSendHistorySchema = new mongoose.Schema({
  templatedId: {
    type: mongoose.Types.ObjectId,
    ref: "EmailTemplate",
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
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
  status: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    required: false,
  },
  sentAt: {
    type: Date,
    default: new Date(),
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  },
});
EmailSendHistorySchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("EmailSendHistory", EmailSendHistorySchema);
