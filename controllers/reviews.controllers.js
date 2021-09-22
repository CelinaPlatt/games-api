const {
  fetchReviews,
  fetchReviewsById,
  updateReviewById,
} = require('../models/reviews.models');

exports.getReviewsById = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const reviewByIdData = await fetchReviewsById(review_id);
    if (reviewByIdData) {
      res.status(200).send({ review: reviewByIdData });
    } else {
      await Promise.reject({ status: 404, msg: 'Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.patchReviewById = async (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  try {
    const patchedReviewData = await updateReviewById(review_id, inc_votes);
    res.status(201).send({ review: patchedReviewData });
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
