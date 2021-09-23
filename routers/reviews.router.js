const express = require('express');
const {
  getReviews,
  getReviewsById,
  patchReviewById,
  getCommentsByReviewId,
} = require('../controllers/reviews.controllers');
const reviews = require('../db/data/test-data/reviews');

const reviewsRouter = express.Router();

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReviewsById).patch(patchReviewById);
reviewsRouter.route('/:review_id/comments').get(getCommentsByReviewId);

module.exports = reviewsRouter;
