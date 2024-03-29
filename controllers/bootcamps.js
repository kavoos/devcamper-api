const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamp
// @route   GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Create new bootcamp
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // if user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Update bootcamp
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    delete bootcamp
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: { name: bootcamp.name },
  });
});

// @desc    get bootcamps within a radius
// @route   GET api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get latitude/longitude from the zipcode
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculate radius using radians by dividing distance by radius of the earth
  // radius of earth is 3,963mi or 6,378km
  const EARTH_RADIUS = 3963;
  const radius = distance / EARTH_RADIUS;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    upload photo for bootcamp
// @route   PUT api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadBootcampPHoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const { file } = req.files;

  // make sure that the file is image/photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
        400
      )
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      next(new ErrorResponse('Problem with file upload', 500));
    }

    await Bootcamp.findByIdAndUpdate(
      req.params.id,
      { photo: file.name },
      {
        new: true,
        runValidators: true,
      }
    );
  });

  res.status(200).json({
    success: true,
    data: { photo: file.name },
  });
});
