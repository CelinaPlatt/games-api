const { fetchReviews, fetchReviewsById } = require('../models/reviews.models');

exports.getReviewsById = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const reviewByIdData = await fetchReviewsById(review_id);
    res.status(200).send({ review: reviewByIdData });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviewsData = await fetchReviews();
    res.status(200).send({ reviews: reviewsData });
  } catch (err) {
    next(err);
  }
};
