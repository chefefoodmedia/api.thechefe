const { BadRequestError, NotFoundError } = require("../errors");
const paypal = require("@paypal/payouts-sdk");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const User = require("../models/User");
const RequestFood = require("../models/RequestFood");
const Transaction = require("../models/Transaction");

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Creating an environment if we want to use sandbox or live based on the client id and secret
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const options = { new: true, runValidators: true };

const createTransaction = async (req, res) => {
  let {
    postID,
    transactionID,
    foodRequestID,
    transactionResponse,
    bankAccountToken,
  } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  const post = await Post.findById(postID);
  if (!post) throw new NotFoundError(`No post with id${postID}`);
  //convert transaction response to object
  transactionResponse = JSON.parse(transactionResponse);
  bankAccountToken = JSON.parse(bankAccountToken);

  let transaction = await Transaction.create({
    postID,
    amount: post.amount,
    transactionID,
    foodRequestID,
    createdBy: id,
    postOwner: post.createdBy,
    transactionResponse: transactionResponse,
  });

  //create payout request to bank account using stripe
  const payout = await stripe.payouts.create({
    amount: (post.amount - 2) * 100,
    currency: "eur",
    method: "instant",
    destination: "acct_1ObkbjHGJ2z9a2vj",
  });

  res.status(StatusCodes.CREATED).json({ transaction });
};

const getTransactionDoneByUser = async (req, res) => {
  const { id } = req.user;
  //get all request food done by user with full details of post
  const transaction = await Transaction.find({ createdBy: id }).populate(
    "postID"
  );
  res.status(StatusCodes.OK).json({ transaction });
};

const createPaymentIntent = async (req, res) => {
  const { postID, foodRequestID } = req.body;

  //find request post
  const requestPost = await Post.findById(postID);
  if (!requestPost) throw new NotFoundError(`No post with id${postID}`);

  const requestFood = await RequestFood.findById(foodRequestID);
  if (!requestFood) throw new NotFoundError(`No request food with id${postID}`);

  const customer = await stripe.customers.create({
    name: requestFood.createdByUserName,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: requestPost.amount * 100,
    currency: "eur",
    customer: customer.id,
    description:
      "Food request payment for " +
      requestPost.userDetails.name +
      " for post " +
      requestPost.caption +
      " by " +
      requestFood.createdByUserName,
  });

  if (!paymentIntent)
    throw new BadRequestError("Payment intent could not be created");

  // Return success message or any relevant data
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Payment intent created successfully",
    data: {
      paymentIntent: paymentIntent,
    },
  });
};

module.exports = {
  createTransaction,
  getTransactionDoneByUser,
  createPaymentIntent,
};
