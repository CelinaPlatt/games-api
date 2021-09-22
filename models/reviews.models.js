const db = require('../db/connection');
const reviews = require('../db/data/test-data/reviews');

exports.fetchReviewsById = async (review_id) => {
  const { rows: resultReview } = await db.query(
    `
  SELECT * FROM reviews
  WHERE review_id = $1;
  `,
    [review_id]
  );
  const reviewByIdData = resultReview[0];

  const { rows: resultCommentCount } = await db.query(
    `
  SELECT COUNT (*)
  FROM comments
  WHERE review_id = $1;
  `,
    [review_id]
  );
  const commentCount = resultCommentCount[0].count;

  reviewByIdData.comment_count = commentCount;
  // console.log(reviewByIdData,'<<< review by id data')
  return reviewByIdData;
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
  console.log(reviewsData);

  return reviewsData;
};
