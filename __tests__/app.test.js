const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const app = require('../app.js');
const { string } = require('pg-format');

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
        test('400:responds with a "Bad Request" message when passed an invalid column to sort by', async () => {
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
        test('400:responds with a "Bad Request" message when passed an invalid order value', async () => {
          const res = await request(app)
            .get('/api/reviews?order=bananas')
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
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
        test('200:responds with an empty array of reviews when passed a valid category but has no reviews', async () => {
          const res = await request(app)
            .get('/api/reviews?category=children%27s%20games')
            .expect(200);
          expect(res.body.reviews).toHaveLength(0);
        });
        test('400:responds with a "Bad Request" message when passed a non-existent category', async () => {
          const res = await request(app)
            .get('/api/reviews?category=bananas')
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
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
        test('400:responds with a "Bad Request" message when passed an invalid review_id', async () => {
          res = await request(app).get('/api/reviews/a1').expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
        test('404:responds with a "Not Found" message when passed a valid review_id that does not exist yet', async () => {
          res = await request(app).get('/api/reviews/20').expect(404);
          expect(res.body.msg).toBe('Not Found');
        });
      });
      describe('PATCH', () => {
        describe('review votes', () => {
          test('200:responds with the updated review object, when passed an object specifying the number of votes to increment: { inc_votes: newVoteNum } ', async () => {
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
          test('400:responds with a "Bad Request" message when passed an invalid review_id', async () => {
            res = await request(app)
              .patch('/api/reviews/a12')
              .send({ inc_votes: -20 })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid review_id that does not exist yet', async () => {
            res = await request(app)
              .patch('/api/reviews/20')
              .send({ inc_votes: -10 })
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('400:responds with a "Bad Request" message when passed an empty body', async () => {
            res = await request(app)
              .patch('/api/reviews/12')
              .send()
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when an invalid property name in the body', async () => {
            res = await request(app)
              .patch('/api/reviews/12')
              .send({ votes: 10 })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an invalid property value in the body', async () => {
            res = await request(app)
              .patch('/api/reviews/12')
              .send({ inc_votes: 'A' })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
        });
        describe('review body', () => {
          test('200:responds with the updated review object', async () => {
            const res = await request(app)
              .patch('/api/reviews/2')
              .send({
                review_body: 'Not suitable for the clumsy',
              })
              .expect(200);
            expect(res.body.review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: 'Not suitable for the clumsy',
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(String),
            });
          });
          test('200:works to update both `review_body` and `votes` properties', async () => {
            const res = await request(app)
              .patch('/api/reviews/2')
              .send({
                review_body: 'Not suitable for the clumsy',
                inc_votes: 10,
              })
              .expect(200);
            expect(res.body.review).toMatchObject({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: 'Not suitable for the clumsy',
              category: expect.any(String),
              created_at: expect.any(String),
              votes: '15',
            });
          });
          test('400:responds with a "Bad Request" message when passed an invalid review_id', async () => {
            const res = await request(app)
              .patch('/api/reviews/a12')
              .send({ review_body: 'Not suitable for the clumsy' })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid but non-existent review_id', async () => {
            const res = await request(app)
              .patch('/api/reviews/20')
              .send({ review_body: 'Not suitable for the clumsy' })
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('400:responds with a "Bad Request" message when passed an empty body', async () => {
            const res = await request(app)
              .patch('/api/reviews/2')
              .send()
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when an invalid property name in the body', async () => {
            const res = await request(app)
              .patch('/api/reviews/2')
              .send({ reviewbody: 'Not suitable for the clumsy' })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an invalid property value in the body', async () => {
            const res = await request(app)
              .patch('/api/reviews/2')
              .send({ review_body: 34 })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
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
          test('400:responds with a "Bad Request" message when passed an invalid review_id', async () => {
            res = await request(app)
              .get('/api/reviews/a12/comments')
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid review_id that does not exist yet', async () => {
            res = await request(app)
              .get('/api/reviews/300/comments')
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('200:responds with an empty array of comments when passed a valid review_id but has no comments', async () => {
            res = await request(app)
              .get('/api/reviews/11/comments')
              .expect(200);
            expect(res.body.comments).toHaveLength(0);
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
          test('201:ignores unnecessary properties', async () => {
            res = await request(app)
              .post('/api/reviews/2/comments')
              .send({
                comment_id: 9009,
                country: 'UK',
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
          test('400:responds with a "Bad Request" message when passed an invalid review_id ', async () => {
            res = await request(app)
              .post('/api/reviews/a/comments')
              .send({
                username: 'mallionaire',
                body: "This is my sister's cat's absolute favourite!",
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid but non-existent review_id ', async () => {
            res = await request(app)
              .post('/api/reviews/50/comments')
              .send({
                username: 'mallionaire',
                body: "This is my sister's cat's absolute favourite!",
              })
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('400:responds with a "Bad Request" message when passed an invalid username', async () => {
            res = await request(app)
              .post('/api/reviews/2/comments')
              .send({
                username: 'lola',
                body: 223,
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('DELETE', () => {
        test('204:responds with an empty body after successfully deleting the specified comment, when passed a valid comment_id', async () => {
          const res = await request(app).delete('/api/comments/2').expect(204);
          expect(res.body).toEqual({});
        });
        test('404:responds with a "Not Found" message when passed a valid comment_id that does not exist yet', async () => {
          const res = await request(app)
            .delete('/api/comments/200')
            .expect(404);
          expect(res.body.msg).toBe('Not Found');
        });
        test('400:responds with a "Bad Request" message when passed an invalid comment_id', async () => {
          const res = await request(app)
            .delete('/api/comments/ab2')
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
      });
      describe('PATCH', () => {
        describe('comment votes', () => {
          test('200:responds with the updated comment object, when passed an object specifying the number of votes to increment: { inc_votes: newVoteNum } ', async () => {
            const res = await request(app)
              .patch('/api/comments/3')
              .send({ inc_votes: 20 })
              .expect(200);
            expect(res.body.comment).toMatchObject({
              body: expect.any(String),
              votes: '30',
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
          test('200:works for decrementing votes too', async () => {
            const res = await request(app)
              .patch('/api/comments/3')
              .send({ inc_votes: -10 })
              .expect(200);
            expect(res.body.comment).toMatchObject({
              body: expect.any(String),
              votes: '0',
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
          test('400:responds with a "Bad Request" message when passed an invalid comment_id', async () => {
            const res = await request(app)
              .patch('/api/comments/ab')
              .send({ inc_votes: 20 })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid comment_id that does not exist yet', async () => {
            const res = await request(app)
              .patch('/api/comments/200')
              .send({ inc_votes: 20 })
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('400:responds with a "Bad Request" message when passed an incorrect body: empty request body', async () => {
            const res = await request(app)
              .patch('/api/comments/2')
              .send()
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an incorrect property: property is not a number', async () => {
            const res = await request(app)
              .patch('/api/comments/2')
              .send({ inc_votes: 'a' })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an incorrect property: property is missing', async () => {
            const res = await request(app)
              .patch('/api/comments/2')
              .send({ bananas: 2 })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
        });
        describe('comment body', () => {
          test('200:responds with the updated review object', async () => {
            const res = await request(app)
              .patch('/api/comments/1')
              .send({
                body: 'aMEOWzing!',
              })
              .expect(200);
            expect(res.body.comment).toMatchObject({
              body: 'aMEOWzing!',
              votes: expect.any(String),
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
          test('200:works to update both `body` and `votes` properties', async () => {
            const res = await request(app)
              .patch('/api/comments/1')
              .send({
                body: 'aMEOWzing!',
                inc_votes: -6,
              })
              .expect(200);
            expect(res.body.comment).toMatchObject({
              body: 'aMEOWzing!',
              votes: '10',
              author: expect.any(String),
              review_id: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
      });
    });
  });
  describe('/users', () => {
    describe('GET', () => {
      test('200:responds with an array of user objects', async () => {
        const res = await request(app).get('/api/users').expect(200);
        expect(res.body.users).toHaveLength(4);
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
    });
    describe('POST', () => {
      test('201:responds with the newly posted user object', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({
            username: 'Pete.P',
            name: 'Peter Petterson',
            avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
          })
          .expect(201);
        expect(res.body.user).toMatchObject({
          username: 'Pete.P',
          name: 'Peter Petterson',
          avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
        });
      });
      test('201:ignores unnecessary properties', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({
            username: 'Pete.P',
            name: 'Peter Petterson',
            avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
            age: 23,
          })
          .expect(201);
        expect(res.body.user).toMatchObject({
          username: 'Pete.P',
          name: 'Peter Petterson',
          avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
        });
      });
      test('400:responds with a "Bad Request" message when passed an invalid username', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({
            username: 'Pete P',
            name: 'Peter Petterson',
            avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
          })
          .expect(400);
        expect(res.body.msg).toBe('Bad Request');
      });
      test('400:responds with a "Bad Request" message when passed an invalid body request missing required fields (username or name)', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({
            username: 'Pete.P',
            avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
          })
          .expect(400);
        expect(res.body.msg).toBe('Bad Request');
      });
      test('400:responds with a "Bad Request" message when passed an invalid body request with invalid values on the required fields (username or name)', async () => {
        const res = await request(app)
          .post('/api/users')
          .send({
            username: 'Pete.P',
            name: 33,
            avatar_url: 'https://pbs.twimg.com/media/E2QjFLiVcAQI-pi.jpg',
          })
          .expect(400);
        expect(res.body.msg).toBe('Bad Request');
      });
    });
    describe('/:username', () => {
      describe('GET', () => {
        test('200:responds with a user object', async () => {
          const res = await request(app)
            .get('/api/users/mallionaire')
            .expect(200);
          expect(res.body.user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        test('404:responds with a "Not Found" message when passed a valid but non-existant username', async () => {
          const res = await request(app)
            .get('/api/users/Mr_Mittens')
            .expect(404);
          expect(res.body.msg).toBe('Not Found');
        });
        test('400:responds with a "Bad Request" message when passed an invalid username - has spaces, special characters (other than "_" and ".") or is longer than 30 chars', async () => {
          const res = await request(app)
            .get('/api/users/dolores%2030*')
            .expect(400);
          expect(res.body.msg).toBe('Bad Request');
        });
      });
      describe('PATCH', () => {
        describe('name and avatar_url', () => {
          test('200:responds with the updated user object,when passed a request body with the name and avatar_url properties', async () => {
            const res = await request(app)
              .patch('/api/users/bainesface')
              .send({
                name: 'Diana',
                avatar_url:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQooyy5MoRtUjS67Oy4S_8a0yt4gmzB3CWnoA&usqp=CAU',
              })
              .expect(200);
            expect(res.body.user).toMatchObject({
              username: 'bainesface',
              name: 'Diana',
              avatar_url:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQooyy5MoRtUjS67Oy4S_8a0yt4gmzB3CWnoA&usqp=CAU',
            });
          });
          test('200:works to update only the name', async () => {
            const res = await request(app)
              .patch('/api/users/bainesface')
              .send({
                name: 'Diana',
              })
              .expect(200);
            expect(res.body.user).toMatchObject({
              username: 'bainesface',
              name: 'Diana',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
            });
          });
          test('200:works to update only the avatar_url', async () => {
            const res = await request(app)
              .patch('/api/users/bainesface')
              .send({
                avatar_url:
                  'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/04/1024/512/Bobcat-istock.jpg?ve=1&tl=1',
              })
              .expect(200);
            expect(res.body.user).toMatchObject({
              username: 'bainesface',
              name: 'sarah',
              avatar_url:
                'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/04/1024/512/Bobcat-istock.jpg?ve=1&tl=1',
            });
          });
          test('200:ignores unnecessary properties', async () => {
            const res = await request(app)
              .patch('/api/users/bainesface')
              .send({
                name: 'Diana',
                age: 20,
              })
              .expect(200);
            expect(res.body.user).toMatchObject({
              username: 'bainesface',
              name: 'Diana',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
            });
          });
          test('400:responds with a "Bad Request" message when passed an invalid username - has spaces, special characters (other than "_" and ".") or is longer than 30 chars', async () => {
            const res = await request(app)
              .patch('/api/users/baines*face')
              .send({
                name: 'Diana',
                avatar_url:
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQooyy5MoRtUjS67Oy4S_8a0yt4gmzB3CWnoA&usqp=CAU',
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('404:responds with a "Not Found" message when passed a valid but non-existant username', async () => {
            const res = await request(app)
              .patch('/api/users/Mr_Mittens')
              .send({
                name: 'Bob Bobcat',
                avatar_url:
                  'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/04/1024/512/Bobcat-istock.jpg?ve=1&tl=1',
              })
              .expect(404);
            expect(res.body.msg).toBe('Not Found');
          });
          test('400:responds with a "Bad Request" message when passed an empty request body', async () => {
            res = await request(app)
              .patch('/api/users/bainesface')
              .send()
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an invalid property in the body (should at least have one of the required properties:`name` or `avatar_url`', async () => {
            res = await request(app)
              .patch('/api/users/bainesface')
              .send({ names: 'Bob Bobcat' })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
          test('400:responds with a "Bad Request" message when passed an invalid property value in the body', async () => {
            res = await request(app)
              .patch('/api/users/bainesface')
              .send({
                name: 'Bob Bobcat!',
                avatar_url:
                  'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2021/04/1024/512/Bobcat-istock.jpg?ve=1&tl=1',
              })
              .expect(400);
            expect(res.body.msg).toBe('Bad Request');
          });
        });
      });
    });
  });
});
