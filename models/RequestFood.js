const mongoose = require("mongoose");

const RequestFoodSchema = new mongoose.Schema(
  {
    postID: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
      autopopulate: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
    },
    createdByUserName: {
      type: String,
      required: true,
    },
    createdByImage: {
      type: String,
    },
    requestMessage: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String,
      required: true,
    },
    postOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
    },
    postOwnerUserName: {
      type: String,
      required: true,
    },
    postOwnerImage: {
      type: String,
    },
  },
  { timestamps: true }
);
RequestFoodSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("RequestFood", RequestFoodSchema);
