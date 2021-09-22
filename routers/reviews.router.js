const express = require('express');
const {
  getReviews,
  getReviewsById,
} = require('../controllers/reviews.controllers');
const reviews = require('../db/data/test-data/reviews');
const reviewsByIdRouter = require('./reviews-by-id.router');

const reviewsRouter = express.Router();

reviewsRouter.route('/').get(getReviews);
reviewsRouter.use('/:review_id', getReviewsById);

module.exports = reviewsRouter;
