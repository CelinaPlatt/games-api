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
  await validateUserName(username);

  const result = await db.query(
    `
        SELECT * FROM users
        WHERE username = $1;
    `,
    [username]
  );
  return result.rows[0];
};

exports.insertNewUser = async (username, name, avatar_url) => {
  await validateUserName(username);
  await validateName(name);

  if (!username || !name) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  const result = await db.query(
    `
      INSERT INTO users
      (username,name,avatar_url)
      VALUES
      ($1, $2, $3)
      RETURNING *;
    `,
    [username, name, avatar_url]
  );
  return result.rows[0];
};

exports.updateUser = async (username, name, avatar_url) => {
  await validateUserName(username);
  await validateName(name);

  if (!name && !avatar_url) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryStr = 'UPDATE users SET';
  let valCount = 1;
  const queryValues = [];

  if (name) {
    queryStr += ` name = $${valCount}`;
    queryValues.push(name);
    valCount++;
  }

  if (avatar_url) {
    if (name) {
      queryStr += `,`;
    }
    queryStr += ` avatar_url = $${valCount}`;
    queryValues.push(avatar_url);
    valCount++;
  }

  queryStr += `
      WHERE username = $${valCount}
      RETURNING *;
  `;
  queryValues.push(username);

  const result = await db.query(queryStr, queryValues);
  return result.rows[0];
};

const validateUserName = async (username) => {
  const hasInvalidChar = /[^a-z0-9\._]/i.test(username);
  if (hasInvalidChar || username.length > 30) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
};

const validateName = async (name) => {
  const hasInvalidChar = /[^a-z\s]/i.test(name);
  if (hasInvalidChar) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
};
