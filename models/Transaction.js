const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    postID: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    postOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionResponse: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    transactionID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    foodRequestID: {
      type: mongoose.Types.ObjectId,
      ref: "RequestFood",
      required: true,
    },
    payoutResponse: {
      type: Object,
    },
    transactionResponse: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
