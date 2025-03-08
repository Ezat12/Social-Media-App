const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");

const validatorCreatePost = [
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 2 })
    .withMessage("description is short")
    .isLength({ max: 200 })
    .withMessage("description is long"),
  check("userId").optional().isMongoId().withMessage("invalid id"),
  check("tags").optional().isMongoId().withMessage("invalid id"),
  check("images").notEmpty().withMessage("image is required"),
  check("like").optional().isMongoId().withMessage("invalid id"),
  validatorError,
];

const validatorUpdatePost = [
  check("id").isMongoId().withMessage("invalid id"),
  check("description")
    .optional()
    .isLength({ min: 2 })
    .withMessage("description is short")
    .isLength({ max: 200 })
    .withMessage("description is long"),
  check("userId").optional().isMongoId().withMessage("invalid id"),
  check("tags").optional().isMongoId().withMessage("invalid id"),
  check("images").notEmpty().withMessage("image is required"),
  check("like").optional().isMongoId().withMessage("invalid id"),
  validatorError,
];

const validatorPostIdMongo = [
  check("id").isMongoId().withMessage("invalid id"),
  validatorError,
];

module.exports = {
  validatorCreatePost,
  validatorUpdatePost,
  validatorPostIdMongo,
};
