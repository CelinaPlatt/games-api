const db = require('../db/connection');
const reviews = require('../db/data/test-data/reviews');

exports.fetchReviewsById = async () => {
    // const result = await db.query()
};

exports.fetchReviews = async () => {
  result = await db.query('SELECT * FROM reviews');
  const reviewsData = result.rows;
  // console.log(reviewsData[0]);

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
