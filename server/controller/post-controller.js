const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const ApiError = require("../utils/ApiError");
const apiFeature = require("../utils/apiFeature");
const User = require("../models/userModel");

const getQueryUser = asyncHandler((req, res, next) => {
  req.queryParams = {
    $or: [
      { userId: req?.user?._id || req.params.userId },
      { tags: req?.user?._id || req.params.userId },
    ],
  };
  next();
});

const createPost = asyncHandler(async (req, res, next) => {
  const post = { ...req.body, userId: req.user._id };

  const createNewPost = await Post.create(post);

  if (req.body.tags) {
    const tags = req.body.tags;

    for (let i = 0; i < tags.length; i++) {
      const notification = {
        message: `A mention for you ${req.user.name} in the post ${req.user.description}`,
        type: "tag",
        post_id: createNewPost._id,
        user_id: req.user._id,
      };

      const getUser = await User.findByIdAndUpdate(
        tags[i],
        { $push: { notification } },
        { new: true }
      );
    }
  }

  res.status(201).json({ status: "success", data: createNewPost });
});

const getAllPost = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.queryParams) {
    query = req.queryParams;
  }

  const model = new apiFeature(Post.find(query), req.query)
    .filtering()
    .pagination()
    .search()
    .sort();

  const { findMongoose } = model;

  const posts = await findMongoose;

  res
    .status(200)
    .json({ status: "success", result: posts.length, data: posts });
});

const getDetailPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ApiError(`not found post by id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: post });
});

const updatePost = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const { id } = req.params;

  const post = await Post.findByIdAndUpdate(id, body, { new: true });

  if (!post) {
    return next(new ApiError(`not found post by id ${id}`, 404));
  }

  res.status(200).json({ status: "success", data: post });
});

const deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError("some thing error, not found user", 404));
  }

  const post = await Post.findById(id);
  if (!post) {
    return next(new ApiError(`not found post by id ${id}`, 404));
  }

  if (post.userId._id.toString() !== user._id.toString()) {
    return next(new ApiError("you are not allowed to delete this post", 400));
  }

  await User.updateMany({ savePost: id }, { $pull: { savePost: id } });

  await Post.findByIdAndDelete(id);

  res.status(201).json({ msg: "deleted successfully" });
});

module.exports = {
  createPost,
  getAllPost,
  getDetailPost,
  updatePost,
  deletePost,
  getQueryUser,
};
