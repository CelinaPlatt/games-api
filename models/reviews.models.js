const { patchReviewById } = require('../controllers/reviews.controllers');
const db = require('../db/connection');
const { sort } = require('../db/data/test-data/reviews');
const reviews = require('../db/data/test-data/reviews');
const { formatCommentData } = require('../db/utils/data-manipulation');
const { fetchCategories } = require('./categories.models');

exports.fetchEndpointsJson = async () => {};

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
  if (newVote) {
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
  } else {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
};

exports.fetchReviews = async (
  sort_by = 'created_at',
  order = 'desc',
  category
) => {
  const validOrderInputs = ['asc', 'desc'];
  const validSortByColumns = [
    'owner',
    'title',
    'review_id',
    'category',
    'review_img_url',
    'created_at',
    'comment_count',
  ];

  const fetchedCategories = await fetchCategories();
  const validCategories = fetchedCategories.map((category) => {
    return category.slug;
  });

  if (
    !validOrderInputs.includes(order) ||
    !validSortByColumns.includes(sort_by) ||
    (category && !validCategories.includes(category))
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
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

  if (result.rows.length === 0) {
    await checkReviewExists(review_id);
  }
  return result.rows;
};

const checkReviewExists = async (review_id) => {
  const result = await db.query(
    `
    SELECT * FROM reviews
    WHERE review_id = $1
    `,
    [review_id]
  );

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Not Found' });
  }
};

exports.insertCommentByReviewId = async (review_id, username, body) => {
  await checkReviewExists(review_id);

  const result = await db.query(
    `
  INSERT INTO comments
  (author,review_id,body)
  VALUES
  ($1,$2,$3)
  RETURNING *
  `,
    [username, review_id, body]
  );

  return result.rows[0];
};
