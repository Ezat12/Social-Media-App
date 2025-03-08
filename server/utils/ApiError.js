class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.statue = statusCode?.toString()?.startsWith(4) ? "fail" : "error";
  }
}

module.exports = ApiError;
