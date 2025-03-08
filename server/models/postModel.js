const mongoose = require("mongoose");
const uuid = require("uuid");

const commentsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: [true, "message in comment is required"],
  },
});

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [2, "description is short"],
      max: [200, "description is long"],
    },
    tags: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    images: [
      {
        type: String,
        required: [true, "image is required"],
      },
    ],
    like: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentsSchema],
  },
  { timestamps: true }
);

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId tags like comments.user_id",
    select: "_id , name profileImage",
  });
  next();
});

module.exports = mongoose.model("Post", postSchema);
