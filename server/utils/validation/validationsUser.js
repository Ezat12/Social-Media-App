const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

const validatorCreateUser = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("your name is too short")
    .isLength({ max: 20 })
    .withMessage("your name is too long"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("emile incorrect")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error(`the email is already taken`);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password id required")
    .isLength({ min: 6 })
    .withMessage("Your password is too short"),
  check("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage("your bio is too long"),
  check("friends").optional().isMongoId().withMessage("invalid id"),
  validatorError,
];

const validatorUpdateUser = [
  check("id").optional().isMongoId().withMessage("invalid id"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("your name is too short")
    .isLength({ max: 20 })
    .withMessage("your name is too long")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ name: val });
      if (user) {
        throw new Error(`the name is already taken`);
      }
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("emile incorrect")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error(`the email is already taken`);
      }
      return true;
    }),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Your password is too short"),
  check("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage("your bio is too long"),
  check("friends").optional().isMongoId().withMessage("invalid id"),
  validatorError,
];

const validatorUserIdMongo = [
  check("id").isMongoId().withMessage("invalid id"),
  validatorError,
];
const validatorChangePasswordUser = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      const isCorrect = await bcrypt.compare(val, user.password);

      if (!user || !isCorrect) {
        throw new Error("password not correct");
      }

      return true;
    }),
  check("newPassword").notEmpty().withMessage("new password is required"),
  validatorError,
];

module.exports = {
  validatorCreateUser,
  validatorUpdateUser,
  validatorUserIdMongo,
  validatorChangePasswordUser,
};
