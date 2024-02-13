const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const User = require("../models/User");
const RequestFood = require("../models/RequestFood");
const Transaction = require("../models/Transaction");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

  //set transaction status to request food
  //check if payment is successful then set status to done else set status to failed
  if (transactionResponse.status === "succeeded") {
    await RequestFood.findByIdAndUpdate(
      foodRequestID,
      { status: "done" },
      options
    );
  } else {
    await RequestFood.findByIdAndUpdate(
      foodRequestID,
      { status: "failed" },
      options
    );
  }

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
    application_fee_amount: 200,
    transfer_data: {
      destination: requestPost.createdBy.account_id,
    },
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

const retriveAccountDetails = async (req, res) => {
  const { accountID } = req.body;
  const accountDetails = await stripe.accounts.retrieve(accountID);
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Account details retrive successfully!",
    data: accountDetails,
  });
};

const generateAccountLinks = async (req, res) => {
  const { accountID } = req.body;
  const accountDetails = await stripe.accountLinks.create({
    account: accountID,
    refresh_url: "http://localhost:3000/#",
    return_url: "http://localhost:3000/#",
    type: "account_onboarding",
    collection_options: {
      fields: "eventually_due",
    },
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Account details retrive successfully!",
    data: accountDetails,
  });
};

// const generateAccountLinks = async (req, res) => {
//   const { accountID } = req.body;
//   const accountDetails = await stripe.accountLinks.create({
//     account: accountID,
//     refresh_url: "https://example.com/reauth",
//     return_url: "https://example.com/return",
//     type: "account_onboarding",
//   });
//   res.status(StatusCodes.OK).json({
//     success: true,
//     message: "Account details retrive successfully!",
//     data: accountDetails,
//   });
// };

module.exports = {
  createTransaction,
  getTransactionDoneByUser,
  createPaymentIntent,
  retriveAccountDetails,
  generateAccountLinks,
};
