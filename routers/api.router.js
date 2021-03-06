const express = require('express');
const { getApiEndpoints } = require('../controllers/api-index.controllers');
const { getCategories } = require('../controllers/categories.controllers');
const reviewsRouter = require('./reviews.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router');

const apiRouter = express.Router();

apiRouter.route('/').get(getApiEndpoints);
apiRouter.get('/categories', getCategories);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
