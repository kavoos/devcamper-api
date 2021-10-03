const express = require('express');
const { getReviews } = require('../controllers/reviews');
const Review = require('../models/Review');
const advancedResults = require('../middlewares/advancedResults');
const {
  protect,
  authorize,
  checkExistenceOwnership,
} = require('../middlewares/auth');
const Bootcamp = require('../models/Bootcamp');

const router = express.Router({ mergeParams: true });

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);

module.exports = router;
