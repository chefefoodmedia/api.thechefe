const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const User = require("../models/User");
const RequestFood = require("../models/RequestFood");
const {
  sendFoodRequesOwnerRequestEmail,
  sendFoodRequesRequesterRequestEmail,
} = require("./emailSendHistory");

const options = { new: true, runValidators: true };

const createRequestFood = async (req, res) => {
  const { postID, requestMessage } = req.body;
  const { id } = req.user;
  const user = await User.findById(id);
  const post = await Post.findById(postID);
  if (!post) throw new NotFoundError(`No post with id${postID}`);
  let requestFood = await RequestFood.create({
    postID,
    requestMessage,
    requestStatus: "Pending",
    createdBy: id,
    createdByUserName: user.name,
    createdByImage: user.profileImage,
    postOwner: post.createdBy,
    postOwnerUserName: post.userDetails.name,
    postOwnerImage: post.userDetails.image,
  });
  res.status(StatusCodes.CREATED).json({ requestFood });
  sendFoodRequesOwnerRequestEmail(requestFood);
  sendFoodRequesRequesterRequestEmail(requestFood);
  console.log(requestFood);
};

const getFoodRequestDoneByUser = async (req, res) => {
  const { id } = req.user;
  //get all request food done by user with full details of post
  const requestFood = await RequestFood.find({ createdBy: id }).populate(
    "postID"
  );
  res.status(StatusCodes.OK).json({ requestFood });
};

const getFoodRequestToUser = async (req, res) => {
  const { id } = req.user;
  const requestFood = await RequestFood.find({ postOwner: id });
  res.status(StatusCodes.OK).json({ requestFood });
};

const updateRequestFood = async (req, res) => {
  const { id } = req.params;
  const { requestStatus } = req.body;
  const { id: createdBy } = req.user;

  //find food request
  const requestFood = await RequestFood.findById(id);
  //if food request not found
  if (!requestFood) throw new NotFoundError(`No requestFood with id ${id}`);

  const updateFood = await RequestFood.findByIdAndUpdate(
    { id, userID: createdBy },
    {
      requestStatus,
    },
    runValidators
  );
  res.status(StatusCodes.OK).json({ updateFood });
};

const approveFoodRequest = async (req, res) => {
  const { _id } = req.body;
  const { id: postOwner } = req.user;

  //find food request
  const requestFood = await RequestFood.findById(_id);
  //if food request not found
  if (!requestFood) throw new NotFoundError(`No requestFood with id ${_id}`);

  const updateFood = await RequestFood.findByIdAndUpdate(
    { _id, userID: postOwner },
    {
      requestStatus: "Approved_Pending_Payment",
    }
  );
  let updatedFood = await RequestFood.findById(_id);
  res.status(StatusCodes.OK).json({ updatedFood });
};

const rejectFoodRequest = async (req, res) => {
  const { _id } = req.body;
  const { id: postOwner } = req.user;

  //find food request
  const requestFood = await RequestFood.findById(_id);
  //if food request not found
  if (!requestFood) throw new NotFoundError(`No requestFood with id ${_id}`);

  const updateFood = await RequestFood.findByIdAndUpdate(
    { _id, userID: postOwner },
    {
      requestStatus: "Rejected",
    }
  );
  //get food request details
  let updatedFood = await RequestFood.findById(_id);
  res.status(StatusCodes.OK).json({ updatedFood });
};

module.exports = {
  createRequestFood,
  getFoodRequestDoneByUser,
  getFoodRequestToUser,
  updateRequestFood,
  approveFoodRequest,
  rejectFoodRequest,
};
