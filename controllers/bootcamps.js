const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamp
// @route   GET api/vi/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(201).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single bootcamp
// @route   GET api/vi/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      res.status(400).json({ success: false });
    } else {
      res.status(201).json({
        success: true,
        data: bootcamp,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new bootcamp
// @route   POST api/vi/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update bootcamp
// @route   PUT api/vi/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      res.status(400).json({ success: false });
    } else {
      res.status(201).json({
        success: true,
        data: bootcamp,
      });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    delete bootcamp
// @route   DELETe api/vi/bootcamps/:id
// @access  DELETE
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      res.status(400).json({ success: false });
    } else {
      res.status(201).json({
        success: true,
        data: { name: bootcamp.name },
      });
    }
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
