const express = require("express");
const {
  addLike,
  removeLike,
  addComment,
  removeComment,
  updateComment,
  readNotification,
} = require("../controller/interactions-controller");
const { protectAuth, allowedTo } = require("../controller/auth-controller");
const router = express.Router();

router
  .route("/like/:idPost")
  .post(protectAuth, allowedTo("user", "admin"), addLike)
  .delete(protectAuth, allowedTo("user", "admin"), removeLike);

router
  .route("/comment/:idPost")
  .post(protectAuth, allowedTo("user", "admin"), addComment)
  .put(protectAuth, allowedTo("user", "admin"), removeComment)
  .patch(protectAuth, allowedTo("user", "admin"), updateComment);

router
  .route("/readNotification")
  .put(protectAuth, allowedTo("user"), readNotification);

module.exports = router;
