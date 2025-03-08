const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const { asyncErrorHandler } = require("express-error-catcher");

const getToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRED_TIME,
  });

  return token;
};

const signup = asyncErrorHandler(async (req, res, next) => {
  const body = req.body;

  const user = await User.create(body);

  const token = getToken({ email: user.email });

  res.status(201).json({ status: "success", user, token });
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).sort("notification.createdAt");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }

  user.notification.sort((a, b) => b.createdAt - a.createdAt);

  // await user.save();

  const token = getToken({ email: user.email });

  res.status(201).json({ status: "success", user, token });
});

const protectAuth = asyncErrorHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("you are not login, please login...", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findOne({ email: decoded.email });

  if (!user) {
    return next(new ApiError("the user not exist", 404));
  }

  req.user = user;
  next();
});

const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you cant not allow to access this route", 403));
    }
    next();
  });

const getDataLoggedUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError("not found user", 400));
  }

  res.status(200).json({ status: "success", user });
});

const changePasswordLoggedUser = asyncErrorHandler(async (req, res, next) => {
  const { newPassword } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(newPassword, 12),
    },
    { new: true }
  );

  res.status(201).json({ msg: "success update password", user });
});

const updateDataLoggedUser = asyncErrorHandler(async (req, res, next) => {
  const body = req.body;

  const id = req.user._id;

  const user = await User.findByIdAndUpdate(id, body, { new: true });

  res.status(200).json({ status: "success", user });
});

const savePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.body;
  if (!postId) {
    return next(new ApiError("not found post id", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { savePost: postId } },
    { new: true }
  );

  res.status(200).json({ status: "success", user });
});

const deletePostSave = asyncErrorHandler(async (req, res, next) => {
  const { idPost } = req.params;

  if (!idPost) {
    return next(new ApiError("not found post id", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { savePost: idPost } },
    { new: true }
  );

  res.status(200).json({ status: "success", user });
});

const getAllPostsSave = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select("savePost")
    .populate({ path: "savePost" });

  res.status(200).json({ status: "success", postSave: user.savePost });
});

const addFollow = asyncErrorHandler(async (req, res, next) => {
  const { idUser } = req.body;

  const findUser = await User.findById(idUser);

  if (!findUser) {
    return next(new ApiError("not found user by id", 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { following: idUser } },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("user login not found, please login again", 404));
  }

  findUser.followers.push(user._id);

  const notification = {
    message: `${user.name} starting following you`,
    type: "follow",
    user_id: user._id,
  };

  findUser.notification.push(notification);
  await findUser.save();

  res.status(201).json({ status: "success", user });
});

const deleteFollow = asyncErrorHandler(async (req, res, next) => {
  const { idUser } = req.body;

  const findUser = await User.findById(idUser);

  if (!findUser) {
    return next(new ApiError("not found user by id", 404));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { following: idUser } },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("user login not found, please login again", 404));
  }

  const filterFindUser = findUser.followers.filter(
    (id) => id.toString() !== user._id.toString()
  );

  findUser.followers = filterFindUser;
  await findUser.save();

  res.status(200).json({ status: "success", user });
});

const getAllFollowers = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .select("followers , following")
    .populate({ path: "followers following", select: "name profileImage _id" });

  if (!user) {
    return next(new ApiError("not found user", 404));
  }

  res.status(200).json({ status: "success", user });
});

module.exports = {
  signup,
  login,
  protectAuth,
  allowedTo,
  getDataLoggedUser,
  changePasswordLoggedUser,
  updateDataLoggedUser,
  savePost,
  deletePostSave,
  getAllPostsSave,
  addFollow,
  deleteFollow,
  getAllFollowers,
};
