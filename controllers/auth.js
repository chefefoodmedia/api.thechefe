const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  AuthenticationError,
} = require("../errors");
const {
  sendSignUpEmail,
  sendForgotPasswordEmail,
  sendCEOSignUpEmail,
} = require("./emailSendHistory");

const register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) throw new BadRequestError("User already exists");
  user = await User.create({ ...req.body });
  const { _id: id, name, profileImage } = user;
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    id,
    token,
    name,
    profileImage,
  });
  sendSignUpEmail(user.id);
  sendCEOSignUpEmail(user.id);
};

const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new BadRequestError("Please provide email");

  const user = await User.findOne({ email: email });
  if (!user) throw new NotFoundError("User doesn't exist");

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp;
  await user.save();
  sendForgotPasswordEmail(user.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "OTP sent successfully", userId: user.id });
};

const changePassword = async (req, res) => {
  const { userId, otp, password } = req.body;
  if (!userId || !otp || !password)
    throw new BadRequestError("Please provide userId, otp and password");

  let user = await User.findById(userId);
  if (!user) throw new NotFoundError("User doesn't exist");
  if (user.otp.toString() !== otp) throw new AuthenticationError("Invalid OTP");
  user.password = password;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Password changed successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new NotFoundError("User doesn't exist");
  const isPasswordCorrect = await user.comparePassword(req.body.password);
  if (!isPasswordCorrect)
    throw new AuthenticationError("It's Ezio's password!! Enter yours");

  const { _id: id, name, profileImage } = user;
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    id,
    token,
    name,
    profileImage,
  });
};

module.exports = { register, login, sendForgotPasswordOTP, changePassword };
