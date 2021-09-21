const express = require('express');

const reviewsByIdRouter = express.Router();

reviewsByIdRouter.route('/').get()

module.exports = reviewsByIdRouter;