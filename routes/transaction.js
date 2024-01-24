const express = require("express");

const {
  createTransaction,
  getTransactionDoneByUser,
  createPaymentIntent,
} = require("../controllers/transactions");
const authorize = require("../middleware/authorization");
const router = express.Router();

router.route("/create").post(authorize, createTransaction);
router.route("/byuser").get(authorize, getTransactionDoneByUser);
router.route("/create-payment-intent").post(authorize, createPaymentIntent);

module.exports = router;
