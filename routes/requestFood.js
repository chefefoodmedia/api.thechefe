const express = require("express");
const {
  createRequestFood,
  getFoodRequestDoneByUser,
  getFoodRequestToUser,
  updateRequestFood,
  approveFoodRequest,
  rejectFoodRequest,
} = require("../controllers/requestFood");
const authorize = require("../middleware/authorization");
const router = express.Router();

router.route("/create").post(authorize, createRequestFood);
router.route("/byuser").get(authorize, getFoodRequestDoneByUser);
router.route("/touser").get(authorize, getFoodRequestToUser);
router.route("/update/:id").patch(authorize, updateRequestFood);
router.route("/approve").post(authorize, approveFoodRequest);
router.route("/reject").post(authorize, rejectFoodRequest);

module.exports = router;
