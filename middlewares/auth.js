const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // set token from bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // set token from cookie
    token = req.cookies.token;
  }

  // make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});

// grant access to specific roles
exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };

exports.checkExistenceOwnership = (model) =>
  asyncHandler(async (req, res, next) => {
    let resource = await model.findById(req.params.id);

    // check that resource exists
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id:${req.params.id}`, 404)
      );
    }
    // if resource exists, make sure user owns the resource, unless they're admin
    if (req.user.role !== 'admin' && resource.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to modify resource ${req.params.id}`,
          401
        )
      );
    }
    next();
  });
