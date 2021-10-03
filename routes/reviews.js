const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviews');
const Review = require('../models/Review');
const advancedResults = require('../middlewares/advancedResults');
const {
  protect,
  authorize,
  checkExistenceOwnership,
} = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);
router
  .route('/:id')
  .get(getReview)
  .put(
    protect,
    authorize('user', 'admin'),
    checkExistenceOwnership(Review),
    updateReview
  )
  .delete(
    protect,
    authorize('user', 'admin'),
    checkExistenceOwnership(Review),
    deleteReview
  );

module.exports = router;
