const express = require('express');
const { getReviews } = require('../controllers/reviews.controllers');
const reviews = require('../db/data/test-data/reviews');
const reviewsByIdRouter = require('./reviews-by-id.router');

const reviewsRouter = express.Router();

reviewsRouter.use('/:review_id',reviewsByIdRouter)

reviewsRouter
.route('/')
.get(getReviews);

module.exports = reviewsRouter;