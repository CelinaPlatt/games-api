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
  const result = await db.query(
    `
        SELECT * FROM users
        WHERE username = $1;
    `,
    [username]
  );
  return result.rows[0];
};
