const db = require('../connection.js');

const format = require('pg-format');
const {
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatCommentData,
} = require('../utils/data-manipulation.js');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS categories,users,reviews,comments;`);

  await db.query(
    `
    CREATE TABLE categories (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(300) NOT NULL
    );
    `
  );

  await db.query(
    `
    CREATE TABLE users (
      username VARCHAR(30) PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      avatar_url VARCHAR(400) NOT NULL
    );
    `
  );

  await db.query(
    `
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      review_body VARCHAR(1200) NOT NULL,
      designer VARCHAR(100),
      review_img_url VARCHAR(500) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes NUMERIC DEFAULT 0,
      category VARCHAR(100) REFERENCES categories(slug),
      owner VARCHAR(30) REFERENCES users(username),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `
  );

  await db.query(
    `
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(30) REFERENCES users(username) NOT  NULL,
      review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
      votes NUMERIC DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(600) NOT NULL
    );
    `
  );

  const formattedCategories = formatCategoryData(categoryData);
  const queryStrCategories = format(
    `
  INSERT INTO categories
  (slug,description)
  VALUES
  %L
  RETURNING *;
  `,
    formattedCategories
  );
  await db.query(queryStrCategories);

  const formattedUsers = formatUserData(userData);
  const queryStrUsers = format(
    `
    INSERT INTO users
    (username,name,avatar_url)
    VALUES
    %L
    RETURNING *;
    `,
    formattedUsers
  );
  await db.query(queryStrUsers);

  const formattedReviews = formatReviewData(reviewData);
  const queryStrReviews = format(
    `
    INSERT INTO reviews
    (title, review_body, designer, review_img_url,votes, category, owner, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    formattedReviews
  );
  await db.query(queryStrReviews);

  const formattedComments = formatCommentData(commentData);
  const queryStrComments = format(
    `
    INSERT INTO comments
    (author, review_id, votes, created_at, body)
    VALUES
    %L
    RETURNING *;
    `,
    formattedComments
  );
  await db.query(queryStrComments);
};

module.exports = seed;
