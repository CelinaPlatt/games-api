const db = require('../connection.js');

const format = require("pg-format");

const seed = async(data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // Drop tables if exist
  const dropTables = await db.query(`DROP TABLE IF EXISTS categories,users,reviews,comments;`);
  console.log(dropTables.command + ' all tables');

  // 1. create tables
  const createCategoryTable = await db.query(
    `
    CREATE TABLE categories (
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(300) NOT NULL
    );
    `
  );
  console.log(createCategoryTable.command + ' categories')

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

  const createReviewsTable = await db.query(
    `
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(250) NOT NULL,
      review_body VARCHAR(600) NOT NULL,
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

  const createCommentsTable = await db.query(
    `
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(100) REFERENCES users(username) NOT  NULL,
      review_id INTEGER REFERENCES reviews(review_id),
      votes NUMERIC DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body VARCHAR(600) NOT NULL
    );
    `
  );
  console.log(createCommentsTable.command + ' comments')


 
  // // 2. insert data
};

module.exports = seed;
