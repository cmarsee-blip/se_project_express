function errorHandler(err, req, res, next) {
  const { statusCode = 500, message } = err;
  const responseMessage =
    statusCode === 500 ? "An internal server error occurred" : message;
  res.status(statusCode).send({ message: responseMessage });
}

module.exports = errorHandler;
