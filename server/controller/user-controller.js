const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const apiFeature = require("../utils/apiFeature");

const createUser = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const user = await User.create(body);

  res.status(201).json({ status: "success", user });
});

const getAllUser = asyncHandler(async (req, res, next) => {
  const countDocument = await User.countDocuments();
  const model = new apiFeature(
    User.find({}, "-password -role -savePost -email -notification"),
    req.query
  )
    .filtering()
    .pagination()
    .search();

  const { findMongoose } = model;
  const userModel = await findMongoose;

  let moreResult = true;

  if (userModel.length < countDocument) {
    moreResult = true;
  } else {
    moreResult = false;
  }
  res.status(200).json({
    status: "success",
    result: userModel.length,
    moreResult,
    users: userModel,
  });
});

const getDetailsUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError(`not found user by id ${id}`, 400));
  }

  res.status(200).json({ status: "success", user });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, body, { new: true });

  if (!user) {
    return next(new ApiError(`not found user by id ${id}`, 400));
  }

  res.status(201).json({ status: "success", user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ApiError(`not found user ny id ${id}`, 400));
  }

  res.status(200).json({ msg: "deleted successfully" });
});

module.exports = {
  createUser,
  getAllUser,
  getDetailsUser,
  updateUser,
  deleteUser,
};
