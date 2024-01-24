const express = require("express");

const {
  createTransaction,
  getTransactionDoneByUser,
  createPaymentIntent,
  retriveAccountDetails,
  generateAccountLinks
} = require("../controllers/transactions");
const authorize = require("../middleware/authorization");
const router = express.Router();

router.route("/create").post(authorize, createTransaction);
router.route("/byuser").get(authorize, getTransactionDoneByUser);
router.route("/create-payment-intent").post(authorize, createPaymentIntent);
router.route("/retriveAccountDetails").post(authorize,retriveAccountDetails);
router.route("/generateAccountLinks").post(authorize,generateAccountLinks);

module.exports = router;
