const express = require('express');
const { getCategories } = require('../controllers/categories.controllers');
const { getAvailableEndPoints } = require('../controllers/enpointsIndex.controllers');
const reviewsRouter = require('./reviews.router');


const apiRouter = express.Router();


apiRouter.get('/categories',getCategories);

apiRouter.use('/reviews',reviewsRouter);

// apiRouter.use('/',childRouter);
// apiRouter.use('/',controller);

module.exports = apiRouter;
