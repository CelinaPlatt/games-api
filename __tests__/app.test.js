const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api', () => {
  describe('/', () => {
    describe('GET', () => {
      test('200:returns a JSON object describing all the available endpoints on the API', async () => {
        res = await request(app).get('/api').expect(200);
        expect(Object.keys(res.body.endpoints)).toEqual([
          'GET /api',
          'GET /api/categories',
          'GET /api/reviews',
          'GET /api/reviews/:review_id',
          'PATCH /api/reviews/:review_id',
          'GET /api/reviews/:review_id/comments',
          'POST /api/reviews/:review_id/comments',
        ]);
      });
    });
  });
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
      test('200:review objects are sorted by date (created_at) in descending order by default', async () => {
        const res = await request(app).get('/api/reviews').expect(200);
        expect(res.body.reviews).toBeSortedBy('created_at', {
          descending: true,
        });
      });
      describe('?sort_by=column-name', () => {
        test('200:review objects are sorted by any valid column specified', async () => {
          const res = await request(app)
            .get('/api/reviews?sort_by=title')
            .expect(200);
          expect(res.body.reviews).toBeSortedBy('title', { coerce: true });
        });
        test('400:responds with a "bad request" message when passed an invalid column to sort by', async () => {
          const res = await request(app)
            .get('/api/reviews?sort_by=date')
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
      });
      describe('?order=asc/desc', () => {
        test('200:review objects are sorted by ascending order when specified', async () => {
          const res = await request(app)
            .get('/api/reviews?order=asc')
            .expect(200);
          expect(res.body.reviews).toBeSortedBy('created_at');
        });
        test('200:review objects are sorted by column and order specified', async () => {
          const res = await request(app)
            .get('/api/reviews?sort_by=review_id&order=desc')
            .expect(200);
          expect(res.body.reviews).toBeSortedBy('review_id', {
            descending: true,
          });
        });
      });
      describe('?category=category-name', () => {
        test('200:review objects are sorted by category specified', async () => {
          const res = await request(app)
            .get('/api/reviews?category=social%20deduction')
            .expect(200);
          expect(res.body.reviews).toHaveLength(11);
          res.body.reviews.forEach((review) => {
            expect(review.category).toBe('social deduction');
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
        test('200:responds with the updated review object, when passed an object specifying the number of votes to increment :{ inc_votes: newVoteNum } ', async () => {
          res = await request(app)
            .patch('/api/reviews/12')
            .send({ inc_votes: 20 })
            .expect(200);
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
        test('200:works for decrementing votes too', async () => {
          res = await request(app)
            .patch('/api/reviews/12')
            .send({ inc_votes: -20 })
            .expect(200);
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
      describe('/comments', () => {
        describe('GET', () => {
          test('200: responds with an array of comments objects on review specified', async () => {
            const res = await request(app)
              .get('/api/reviews/2/comments')
              .expect(200);
            expect(res.body.comments).toHaveLength(3);
            res.body.comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(String),
                author: expect.any(String),
                review_id: expect.any(Number),
                created_at: expect.any(String),
              });
            });
          });
          test('400:responds with a "bad request" message when passed an invalid review_id', async () => {
            res = await request(app)
              .get('/api/reviews/a12/comments')
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed when passed a valid review_id that does not exist yet', async () => {
            res = await request(app)
              .get('/api/reviews/300/comments')
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
        });
        describe('POST', () => {
          test('201:responds with the new posted comment object, when passed a user name and a review body ', async () => {
            res = await request(app)
              .post('/api/reviews/2/comments')
              .send({
                username: 'mallionaire',
                body: "This is my sister's cat's absolute favourite!",
              })
              .expect(201);
            expect(res.body.comment).toMatchObject({
              comment_id: expect.any(Number),
              author: 'mallionaire',
              review_id: 2,
              votes: '0',
              created_at: expect.any(String),
              body: "This is my sister's cat's absolute favourite!",
            });
          });
          test('400:responds with a "bad request" message when passed an invalid username', async () => {
            res = await request(app)
              .post('/api/reviews/2/comments')
              .send({
                username: 'lola',
                body: 223,
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "bad request" message when passed an invalid review_id', async () => {
            res = await request(app)
              .post('/api/reviews/200/comments')
              .send({
                username: 'mallionaire',
                body: 223,
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
        });
      });
    });
  });
});
