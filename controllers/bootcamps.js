const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middlewares/async');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamp
// @route   GET api/vi/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/(gt|gte|lt|lte|in)/g, (match) => `$${match}`);

  const query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;

  res.status(201).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc    Get single bootcamp
// @route   GET api/vi/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Create new bootcamp
// @route   POST api/vi/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    Update bootcamp
// @route   PUT api/vi/bootcamps/:id
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

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc    delete bootcamp
// @route   DELETE api/vi/bootcamps/:id
// @access  DELETE
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: { name: bootcamp.name },
  });
});

// @desc    get bootcamps within a radius
// @route   GET api/vi/bootcamps/radius/:zipcode/:distance
// @access  DELETE
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
