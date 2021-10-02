const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // log to console for dev
  console.log(err.stack.red);

  switch (err.name) {
    // mongoose bad ObjectId
    case 'CastError':
      error = new ErrorResponse(
        `Resource not found with id of ${error.value}`,
        404
      );
      break;

    // mongoose validation error
    case 'ValidationError':
      error = new ErrorResponse(Object.values(err.errors), 400);
      break;

    case 'MongoError':
      switch (err.code) {
        // mongoose duplicate key
        case 11000:
          error = new ErrorResponse(`Duplicate field`, 400);
          break;
      }
      break;

    case 'JsonWebTokenError':
      error = new ErrorResponse('Not authorized', 401);
      break;

    case 'TokenExpiredError':
      error = new ErrorResponse('Please log in again', 401);
      break;
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
