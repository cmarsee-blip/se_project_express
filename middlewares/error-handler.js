function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;
  const responseMessage =
    statusCode === 500 ? "An internal server error occurred" : message;
  res.status(statusCode).send({ message: responseMessage });
}

// import error classes from the errors folder and re-export them so other modules
// can destructure them from this middleware file (existing code expects this)
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

module.exports = {
  errorHandler,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
