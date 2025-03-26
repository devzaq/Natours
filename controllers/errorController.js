const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const error = new AppError(`Invalid ${err.path} : ${err.value}`, 400);
  return error;
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const error = new AppError(
    `Duplicate Field Value: ${value} please use another value.`,
    400,
  );
  return error;
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const error = new AppError(`Invalid Input Data. ${errors.join('. ')}`, 400);
  return error;
};
const handleJsonWebTokenError = () =>
  new AppError(`Invalid Token Please login again`, 401);

const handleTokenExpiredError = () =>
  new AppError(`Token Already Expired Please login again`, 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      console.error('ERROR:🔥', err.message);
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Please try again later!',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  // console.error(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'developement') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    // console.log('🔥PRODUCTION ERROR🔥', err.code);

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};
