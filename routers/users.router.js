const express = require('express');
const { getUsers, getUserByUsername, postNewUser } = require('../controllers/users.controllers');

const usersRouter = express.Router();

usersRouter.route('/').get(getUsers).post(postNewUser);
usersRouter.route('/:username').get(getUserByUsername);

module.exports = usersRouter;
