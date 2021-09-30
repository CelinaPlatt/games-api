const db = require('../db/connection');

exports.fetchUsers = async () => {
  const result = await db.query(
    `
        SELECT * FROM users;
    `
  );
  return result.rows;
};

exports.fetchUserByUsername = async (username) => {
  const hasInvalidChar = /[^a-z0-9\._]/i.test(username);

  if (hasInvalidChar || username.length > 30) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const result = await db.query(
    `
        SELECT * FROM users
        WHERE username = $1;
    `,
    [username]
  );
  return result.rows[0];
};
