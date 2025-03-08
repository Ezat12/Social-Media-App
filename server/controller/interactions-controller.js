const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");

const addLike = asyncHandler(async (req, res, next) => {
  const { idPost } = req.params;

  const post = await Post.findById(idPost);

  const isInclude = post.like.some(
    (l) => l._id.toString() === req.user._id.toString()
  );
  if (isInclude) {
    return next(new ApiError("you have already like", 400));
  }

  post.like.push(req.user._id);
  await post.save();

  const notification = {
    message: `${req.user.name} Added Like in Post ${post.description}`,
    type: "like",
    post_id: post._id,
    user_id: req.user._id,
  };

  const user = await User.findByIdAndUpdate(
    post.userId._id,
    {
      $push: { notification },
    },
    { new: true }
  );

  const postUpdate = await Post.findById(idPost);

  res.status(201).json({ status: "success", post: postUpdate });
});

const removeLike = asyncHandler(async (req, res, next) => {
  const { idPost } = req.params;

  const post = await Post.findByIdAndUpdate(
    idPost,
    { $pull: { like: req.user._id } },
    { new: true }
  );

  res.status(200).json({ status: "success", post });
});

const addComment = asyncHandler(async (req, res, next) => {
  const { idPost } = req.params;
  const { message } = req.body;
  if (!message) {
    return next(new ApiError("message is required"));
  }

  const post = await Post.findById(idPost);

  if (!post) {
    return next(new ApiError("not found post by id", 404));
  }

  const comment = { user_id: req.user._id, message };
  post.comments.push(comment);
  await post.save();

  const notification = {
    message: `${req.user.name} Added Comment in Post ${post.description}`,
    type: "comment",
    post_id: post._id,
    user_id: req.user._id,
  };

  const user = await User.findByIdAndUpdate(
    post.userId._id,
    { $push: { notification } },
    { new: true }
  );

  const updatePost = await Post.findById(idPost);

  res.status(201).json({ status: "success", post: updatePost });
});

const removeComment = asyncHandler(async (req, res, next) => {
  const { idPost } = req.params;
  const { id } = req.body;

  if (!id) {
    return next(new ApiError("ID is required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError("Invalid comment ID format", 400));
  }

  const post = await Post.findByIdAndUpdate(
    idPost,
    { $pull: { comments: { _id: new mongoose.Types.ObjectId(id) } } },
    { new: true }
  );

  res.status(200).json({ status: "success", post });
});

const updateComment = asyncHandler(async (req, res, next) => {
  const { idPost } = req.params;
  const { id, message } = req.body;
  if (!message || !id) {
    return next(new ApiError("not found id or message", 400));
  }
  if (!idPost) {
    return next(new ApiError("not found id post", 400));
  }

  const post = await Post.findById(idPost);

  if (!post) {
    return next(new ApiError("not found post by id", 404));
  }

  const getIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === id
  );

  if (getIndex === -1) {
    return next(new ApiError("not found comment", 404));
  }

  post.comments[getIndex].message = message;

  await post.save();

  const postUpdate = await Post.findById(idPost);

  res.status(200).json({ status: "success", post: postUpdate });
});

const readNotification = asyncHandler(async (req, res, next) => {
  const user = await User.updateOne(
    {
      _id: req.user._id,
      "notification.read": false,
    },
    { $set: { "notification.$[].read": true } }
  );

  const getUser = await User.findById(req.user._id);

  res.status(200).json({ status: "success", user: getUser });
});

module.exports = {
  addLike,
  removeLike,
  addComment,
  removeComment,
  updateComment,
  readNotification,
};
