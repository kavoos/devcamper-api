// @desc    Get all bootcamp
// @route   GET api/vi/bootcamps
// @access  Public
exports.getBootcamps = (req, res, nex) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @desc    Get single bootcamp
// @route   GET api/vi/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, nex) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @desc    Create new bootcamp
// @route   POST api/vi/bootcamps
// @access  Private
exports.createBootcamp = (req, res, nex) => {
  res.status(200).json({ success: true, msg: 'Create new bootcamp' });
};

// @desc    Update bootcamp
// @route   PUT api/vi/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, nex) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    delete bootcamp
// @route   DELETe api/vi/bootcamps/:id
// @access  DELETE
exports.deleteBootcamp = (req, res, nex) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
