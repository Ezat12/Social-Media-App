const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err.name === "TokenExpiredError") {
    err = TokenExpiredError();
  }
  if (err.name === "JsonWebTokenError") {
    err = jsonWebTokenError();
  }

  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const castError = (err, next) =>
  new ApiError(`not found post by id ${err.value}`, 404);

const TokenExpiredError = () =>
  new ApiError("Sorry, login has ended!, login again", 401);

const jsonWebTokenError = () =>
  new ApiError("Some thing error!, login again", 498);

module.exports = errorHandler;
