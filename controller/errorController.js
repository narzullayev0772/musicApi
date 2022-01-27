const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `invalid error ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDublicateErr = (err) => {
  const message = `dublicate error in database`;
  return new AppError(message, 400);
};

const handleValidationErr = () => {
  const message = `Validate err`;
  return new AppError(message, 400);
};

const handleJWTErr = () => {
  const message = `Jwt error,${err}`;
  return new AppError(message, 401);
};

const handleJWTExpiredErr = (err) => {
  const message = `Your token has expied,${err}`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error", err);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if ((error.name = "CastError")) error = handleCastErrorDB(error);
    if ((error.name = 1100)) error = handleDublicateErr(error);
    if ((error.name = "ValidationError")) error = handleValidationErr(error);
    if ((error.name = "JsonWebTokenError")) error = handleJWTErr();
    if ((error.name = "TokenExpiredError")) error = handleJWTExpiredErr();

    sendErrorProd(error, res);
  }
};
