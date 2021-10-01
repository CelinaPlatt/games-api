const db = require('../db/connection');

exports.deleteFromByCommentId = async (comment_id) => {
  await checkCommentExists(comment_id);
  const result = await db.query(
    `
      DElETE FROM comments
      WHERE comment_id = $1;
    `,
    [comment_id]
  );
  return result.rows[0];
};

const checkCommentExists = async (comment_id) => {
  const result = await db.query(
    `
      SELECT * FROM comments
      WHERE comment_id = $1;
    `,
    [comment_id]
  );

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Not Found' });
  }
};

exports.updateCommentById = async (comment_id, newVote, body) => {
  if (!newVote && !body) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryStr = 'UPDATE comments SET';
  const queryValues = [];
  let valCount = 1;

  if (newVote) {
    queryStr += ` votes = votes + $${valCount}`;
    queryValues.push(newVote);
    valCount++;
  }
  if (body) {
    if (newVote) {
      queryStr += ',';
    }
    queryStr += ` body = $${valCount}`;
    queryValues.push(body);
    valCount++;
  }

  queryStr += ` 
    WHERE comment_id = $${valCount} 
    RETURNING *;
  `;
  queryValues.push(comment_id);

  const result = await db.query(queryStr, queryValues);

  return result.rows[0];
};
