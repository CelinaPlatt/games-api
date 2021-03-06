const {
  fetchReviews,
  fetchReviewsById,
  updateReviewById,
  fetchCommentsByReviewId,
  insertCommentByReviewId,
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
  const { inc_votes, review_body } = req.body;
  try {
    const patchedReviewData = await updateReviewById(review_id, inc_votes,review_body);
    if (patchedReviewData) {
      res.status(200).send({ review: patchedReviewData });
    } else {
      await Promise.reject({ status: 404, msg: 'Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  const { sort_by, order, category } = req.query;
  try {
    const reviewsData = await fetchReviews(sort_by, order, category);
    res.status(200).send({ reviews: reviewsData });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByReviewId = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const commentsByReviewIdData = await fetchCommentsByReviewId(review_id);
    res.status(200).send({ comments: commentsByReviewIdData });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByReviewId = async (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;
  try {
    const newCommentPosted = await insertCommentByReviewId(
      review_id,
      username,
      body
    );
    res.status(201).send({ comment: newCommentPosted });
  } catch (err) {
    next(err);
  }
};
