const express = require("express");
const { validatorCreateUser } = require("../utils/validation/validationsUser");
const { signup, login } = require("../controller/auth-controller");
const router = express.Router();

router.route("/signup").post(validatorCreateUser, signup);
router.route("/login").post(login);

module.exports = router;
