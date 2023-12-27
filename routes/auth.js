const express = require("express");
const {
  register,
  login,
  sendForgotPasswordOTP,
  changePassword,
} = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", sendForgotPasswordOTP);
router.post("/change-password", changePassword);

module.exports = router;
