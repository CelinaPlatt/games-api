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
  console.log(username, '<< controller username');
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
