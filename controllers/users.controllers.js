const { fetchUsers, fetchUserByUsername } = require('../models/users.models');

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
    res.status(200).send({ user: userData });
  } catch (err) {
    next(err);
  }
};
