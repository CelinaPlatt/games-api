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
          res = await request(app).get('/api/reviews/1').expect(200);
          expect(res.body.review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
        test('400:responds with a "bad request" message when passed an invalid review_id', async () => {
          res = await request(app).get('/api/reviews/a1').expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
        test('404:responds with a "Not Found" message when passed a valid review_id that does not exist yet', async () => {
          res = await request(app).get('/api/reviews/20').expect(404);
          expect(res.body.msg).toBe('Not Found');
        });
      });
      describe('PATCH', () => {
        test('201:responds with the updated review object, when passed an object specifying the number of votes to increment :{ inc_votes: newVoteNum } ', async () => {
          res = await request(app)
            .patch('/api/reviews/12')
            .send({ inc_votes: 20 })
            .expect(201);
          expect(res.body.review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: '120',
          });
        });
        test('201:works for decrementing votes too', async () => {
          res = await request(app)
            .patch('/api/reviews/12')
            .send({ inc_votes: -20 })
            .expect(201);
          expect(res.body.review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: '80',
          });
        });
        test('400:responds with a "bad request" message when passed an invalid review_id', async () => {
          res = await request(app)
            .patch('/api/reviews/a12')
            .send({ inc_votes: -20 })
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
        test('404:responds with a "Not Found" message when passed when passed a valid review_id that does not exist yet', async () => {
          res = await request(app).patch('/api/reviews/20').expect(404);
          expect(res.body.msg).toBe('Not Found');
        });
      });
    });
  });
});
