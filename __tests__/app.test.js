const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
  describe('/categories', () => {
    describe('GET', () => {
      test('200:responds with an array of category objects', async () => {
        const res = await request(app).get('/api/categories').expect(200);
        expect(res.body.categories).toHaveLength(4);
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
    });
  });
  describe('/reviews', () => {
    describe('GET', () => {
      test('200: responds with an array of review objects', async () => {
        const res = await request(app).get('/api/reviews').expect(200);
        expect(res.body.reviews).toHaveLength(13);
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
    });
    describe('/:review_id', () => {
      describe('GET', () => {
        test('200:responds with a review object', async () => {
          res = await request(app).get('/api/reviews/:review_id').expect(200);
          expect(res.body.review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
    });
  });
});

// owner which is the username from the users table
// title
// review_id
// review_body
// designer
// review_img_url
// category
// created_at
// votes
// comment_count which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this
