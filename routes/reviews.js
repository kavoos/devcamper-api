const express = require('express');
const { getReviews, getReview } = require('../controllers/reviews');
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
router.route('/:id').get(getReview);

module.exports = router;
