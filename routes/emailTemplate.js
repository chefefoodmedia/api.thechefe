const express = require("express");
const {
  createEmailTemplate,
  getEmailTemplate,
} = require("../controllers/emailTemplate");

const authorize = require("../middleware/authorization");
const router = express.Router();

router.route("/create").post(authorize, createEmailTemplate);
router.route("/").get(authorize, getEmailTemplate);

module.exports = router;
