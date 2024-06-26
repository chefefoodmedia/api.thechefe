const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    location: {
      type: String,
    },
    //start to do : milan - from request get all other data
    ingredients: {
      type: String,
    },
    isDonate: {
      type: Boolean,
    },
    amount: {
      type: Number,
    },
    availableDateTime: {
      type: Date,
    },
    expireDateTime: {
      type: Date,
    },
    categories: [String],
    diatryPreferences: [String],
    image: {
      src: {
        type: String,
      },
      publicID: {
        type: String,
      },
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true,
    },
    userDetails: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
    },
    likes: {
      type: [String],
    },
    comments: [
      {
        commentedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        commentedAt: {
          type: Date,
          default: new Date(),
          required: true,
        },
        replies: [
          {
            commentedBy: {
              type: mongoose.Types.ObjectId,
              ref: "User",
              required: true,
            },
            commentId: {
              type: mongoose.Types.ObjectId,
              required: true,
            },
            comment: {
              type: String,
              required: true,
            },
            commentedAt: {
              type: Date,
              default: new Date(),
              required: true,
            },
            replyTo: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
PostSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Post", PostSchema);
