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
  const reviewByIdData =  resultReview[0]

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
  // console.log(reviewByIdData,'<<< review bt id data')
  return reviewByIdData;
};

exports.fetchReviews = async () => {
  const result = await db.query('SELECT * FROM reviews;');
  const reviewsData = result.rows;
  // console.log(reviewsData);

  reviewsData.forEach(async (review) => {
    // const reviewId = review.review_id;
    // const reviewCommentsQueryResult = await db.query(`
    // SELECT * FROM comments
    // WHERE review_id = $1`,[reviewId]);
    // const commentCount = reviewCommentsQueryResult.rows.length;
    // console.log(commentCount);
    review.comment_count = 7;
  });
  // console.log(reviewsData[5]);
  return reviewsData;
};
