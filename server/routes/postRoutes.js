const express = require("express");
const {
  createPost,
  getAllPost,
  getDetailPost,
  updatePost,
  deletePost,
  getQueryUser,
} = require("../controller/post-controller");
const {
  validatorCreatePost,
  validatorUpdatePost,
  validatorPostIdMongo,
} = require("../utils/validation/validationPost");
const { protectAuth, allowedTo } = require("../controller/auth-controller");
const router = express.Router();

router
  .route("/getPostsUserLogged")
  .get(protectAuth, allowedTo("user", "admin"), getQueryUser, getAllPost);
router.route("/getPostsUserUnLogged/:userId").get(getQueryUser, getAllPost);

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("user", "admin"),
    validatorCreatePost,
    createPost
  )
  .get(getAllPost);

router
  .route("/:id")
  .get(validatorPostIdMongo, getDetailPost)
  .put(protectAuth, allowedTo("user", "admin"), validatorUpdatePost, updatePost)
  .delete(
    protectAuth,
    allowedTo("user", "admin"),
    validatorPostIdMongo,
    deletePost
  );

module.exports = router;
