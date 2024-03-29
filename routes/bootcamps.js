const express = require('express');
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
  uploadBootcampPHoto,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middlewares/advancedResults');

// include other resource routes
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const {
  protect,
  authorize,
  checkExistenceOwnership,
} = require('../middlewares/auth');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Bootcamp),
    uploadBootcampPHoto
  );

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Bootcamp),
    updateBootcamp
  )
  .delete(
    protect,
    authorize('publisher', 'admin'),
    checkExistenceOwnership(Bootcamp),
    deleteBootcamp
  );

module.exports = router;
