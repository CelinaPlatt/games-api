const db = require('../connection.js');

const format = require("pg-format");
const { formatCategoryData, formatUserData, formatReviewData, formatCommentData } = require('../utils/data-manipulation.js');

const seed = async(data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // Drop tables if exist
  const dropTables = await db.query(`DROP TABLE IF EXISTS categories,users,reviews,comments;`);
  console.log(dropTables.command + ' all tables');

  // 1. create tables

  //---------Categories Table ------------------

  const createCategoryTable = await db.query(
    `
    CREATE TABLE categories (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(300) NOT NULL
    );
    `
  );
  console.log(createCategoryTable.command + ' categories')

  //---------Users Table ------------------

  const createUsersTable = await db.query(
    `
    CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(400) NOT NULL
    );
    `
  );
  console.log(createUsersTable.command + ' users')

  //---------Reviews Table ------------------

  const createReviewsTable = await db.query(
    `
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      review_body VARCHAR(1200) NOT NULL,
      designer VARCHAR(100),
      review_img_url VARCHAR(500) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes NUMERIC DEFAULT 0,
      category VARCHAR(100) REFERENCES categories(slug),
      owner VARCHAR(100) REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
  );
  console.log(createReviewsTable.command + ' reviews')

  //---------Comments Table ------------------

  const createCommentsTable = await db.query(
    `
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(100) REFERENCES users(username) NOT  NULL,
      review_id INTEGER REFERENCES reviews(review_id),
      votes NUMERIC DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(600) NOT NULL
    );
    `
  );
  console.log(createCommentsTable.command + ' comments')

  // 2. insert data

  //---------Insert into Categories Table ------------------

  const formattedCategories = formatCategoryData(categoryData);
  const queryStrCategories = format (
  `
  INSERT INTO categories
  (slug,description)
  VALUES
  %L
  RETURNING *;
  `,
  formattedCategories
  );
  const insertCategories = await db.query(queryStrCategories);
  console.log('INSERT INTO categories \n',insertCategories.rows[0]);

  //---------Insert into Categories Table ------------------

  const formattedUsers = formatUserData(userData);
  const queryStrUsers = format (
    `
    INSERT INTO users
    (username,name,avatar_url)
    VALUES
    %L
    RETURNING *;
    `,
    formattedUsers
  );
  const insertUsers = await db.query(queryStrUsers);
  console.log('INSERT INTO users \n',insertUsers.rows[0]);

  //---------Insert into Categories Table ------------------

  const formattedReviews = formatReviewData(reviewData);
  const queryStrReviews = format (
    `
    INSERT INTO reviews
    (title, review_body, designer, review_img_url,votes, category, owner, created_at)
    VALUES
    %L
    RETURNING *;
    `,
    formattedReviews
  );
  const insertReviews = await db.query(queryStrReviews);
  console.log('INSERT INTO reviews \n',insertReviews.rows[0]);

  // ---------Insert into Categories Table ------------------

  const formattedComments = formatCommentData(commentData);
  const queryStrComments = format (
    `
    INSERT INTO comments
    (author, review_id, votes, created_at, body)
    VALUES
    %L
    RETURNING *;
    `,
    formattedComments
  );
  const insertComments = await db.query(queryStrComments);
  console.log('INSERT INTO comments \n',insertComments.rows[0]);

};

module.exports = seed;
