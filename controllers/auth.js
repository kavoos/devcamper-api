const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @desc    Register user
// @route   POST api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide both email and password', 400)
    );
  }

  // check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async function (req, res, next) {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Forgot password
// @route   POST api/v1/auth/forgotpasswod
// @access  Public
exports.forgotPassword = asyncHandler(async function (req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with this email', 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  const html = `<div style="margin:16px;font-family:'Trebuchet MS',sans-serif;"><h1>DevCamper</h1><p>You are receiving this email because you (or someone else) has requested the reset of a password.</p><p>Please make a PUT request <a href="${resetUrl}">here.</a></p></div>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
      html,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
