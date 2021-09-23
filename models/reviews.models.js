const { patchReviewById } = require('../controllers/reviews.controllers');
const db = require('../db/connection');
const { sort } = require('../db/data/test-data/reviews');
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

exports.fetchReviews = async (
  sort_by = 'created_at',
  order = 'desc',
  category
) => {
  const validOrderInputs = ['asc', 'desc'];

  if (!validOrderInputs.includes(order)) {
    await Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const validSortByColumns = [
    'owner',
    'title',
    'review_id',
    'category',
    'review_img_url',
    'created_at',
    'comment_count',
  ];

  if (!validSortByColumns.includes(sort_by)) {
    await Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryStr = `
    SELECT reviews.* ,
    COUNT(comments.review_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    `;

  const queryValues = [];

  if (category) {
    console.log(category);
    queryStr += `WHERE reviews.category = $1`;
    queryValues.push(category);
  }

  queryStr += `
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}
  `;

  const result = await db.query(queryStr, queryValues);
  const reviewsData = result.rows;

  return reviewsData;
};

exports.fetchCommentsByReviewId = async (review_id) => {
  const result = await db.query(
    `
    SELECT * FROM comments
    WHERE comments.review_id = $1;   
    `,
    [review_id]
  );
  return result.rows;
};
