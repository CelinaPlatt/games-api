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

exports.fetchReviews = async (sort_by = 'created_at', order = 'desc') => {
  console.log(sort_by,'<<<sort by'),
  console.log(order,'<<<<order by')
  const validOrderInput = ['asc','desc'];
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
  if (!validOrderInput.includes(order)) {
    await Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  const result = await db.query(`
  SELECT reviews.* ,
  COUNT(comments.review_id)::INT AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}
  ;
  `);
  const reviewsData = result.rows;
  // console.log(reviewsData[0].comment_count);
  console.log(reviewsData,'<<<REVIEWS');

  return reviewsData;
};
