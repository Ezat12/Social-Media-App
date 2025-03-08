const express = require("express");
const {
  createUser,
  getAllUser,
  getDetailsUser,
  updateUser,
  deleteUser,
} = require("../controller/user-controller");
const {
  validatorUserIdMongo,
  validatorUpdateUser,
  validatorCreateUser,
  validatorChangePasswordUser,
} = require("../utils/validation/validationsUser");
const {
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
} = require("../controller/auth-controller");

const router = express.Router();

router
  .route("/getDataUser")
  .get(protectAuth, allowedTo("user"), getDataLoggedUser);

router
  .route("/changePasswordUser")
  .put(
    protectAuth,
    allowedTo("user"),
    validatorChangePasswordUser,
    changePasswordLoggedUser
  );

router
  .route("/updateDataUser")
  .put(
    protectAuth,
    allowedTo("user"),
    validatorUpdateUser,
    updateDataLoggedUser
  );

router
  .route("/savePost")
  .get(protectAuth, allowedTo("user"), getAllPostsSave)
  .post(protectAuth, allowedTo("user"), savePost);

router
  .route("/deleteSavePost/:idPost")
  .delete(protectAuth, allowedTo("user"), deletePostSave);

router
  .route("/follow")
  .get(protectAuth, getAllFollowers)
  .put(protectAuth, allowedTo("user"), addFollow)
  .patch(protectAuth, allowedTo("user"), deleteFollow);

router
  .route("/")
  .post(protectAuth, allowedTo("admin"), validatorCreateUser, createUser)
  .get(getAllUser);

router
  .route("/:id")
  .get(validatorUserIdMongo, getDetailsUser)
  .put(protectAuth, allowedTo("admin"), validatorUpdateUser, updateUser)
  .delete(
    protectAuth,
    allowedTo("admin", "user"),
    validatorUserIdMongo,
    deleteUser
  );

module.exports = router;
