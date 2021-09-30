const {
  fetchUsers,
  fetchUserByUsername,
  insertNewUser,
} = require('../models/users.models');

exports.getUsers = async (req, res, next) => {
  try {
    const usersData = await fetchUsers();
    res.status(200).send({ users: usersData });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const userData = await fetchUserByUsername(username);
    if (userData) {
      res.status(200).send({ user: userData });
    } else {
      await Promise.reject({ status: 404, msg: 'Not Found' });
    }
  } catch (err) {
    next(err);
  }
};

exports.postNewUser = async (req, res, next) => {
  const { username, name, avatar_url } = req.body;
  try {
    const newUserData = await insertNewUser(username, name, avatar_url);
    res.status(201).send({ user: newUserData });
  } catch (err) {
    next(err);
  }
};
