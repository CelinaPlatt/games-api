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

exports.insertNewUser = async (username, name, avatar_url) => {
  const usernameIsInvalid = /[^a-z0-9\._]/i.test(username);
  const nameIsInvalid = /[^a-z\s]/i.test(name);

  if (
    !username ||
    !name ||
    usernameIsInvalid ||
    nameIsInvalid ||
    username.length > 30
  ) {
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
  const usernameIsInvalid = /[^a-z0-9\._]/i.test(username);

  const nameIsInvalid = /[^a-z\s]/i.test(name);

  if (
    usernameIsInvalid ||
    username.length > 30 ||
    (!name && !avatar_url) ||
    nameIsInvalid
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryStr = `
  UPDATE users SET
  `;
  let queryValues = [];

  if (name) {
    queryStr += 'name = $1';
    queryValues.push(name);

    if (avatar_url) {
      queryStr += `
        , avatar_url = $2 
        WHERE username = $3
        RETURNING *;
      `;
      queryValues.push(avatar_url, username);
    } else {
      queryStr += `
        WHERE username = $2
        RETURNING *;
      `;
      queryValues.push(username);
    }
  } else if (!name && avatar_url) {
    queryStr += `
      avatar_url = $1
      WHERE username = $2
      RETURNING *;
    `;
    queryValues.push(avatar_url, username);
  }
  const result = await db.query(queryStr, queryValues);
  return result.rows[0];
};
