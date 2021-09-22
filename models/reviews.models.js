const { patchReviewById } = require('../controllers/reviews.controllers');
const db = require('../db/connection');
const reviews = require('../db/data/test-data/reviews');

exports.fetchReviewsById = async (review_id) => {
  const result = await db.query(
    `
  SELECT reviews.* ,
  COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `,
    [review_id]
  );
  const reviewData = result.rows[0];
  return reviewData;
};

exports.updateReviewById = async (review_id, newVote) => {
  const patchedReviewData = await db.query(
    `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2 
    RETURNING *;
    `,
    [newVote, review_id]
  );
  return patchedReviewData.rows[0];
};

exports.fetchReviews = async () => {
  const result = await db.query(`
  SELECT reviews.* ,
  COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ;
  `);
  const reviewsData = result.rows;
  console.log(reviewsData[0].comment_count);

  return reviewsData;
};
