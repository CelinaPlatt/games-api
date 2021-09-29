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

exports.updateCommentById = async (comment_id, newVote) => {
  await checkCommentExists(comment_id);
  if (newVote) {
    const result = await db.query(
      `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2 
        RETURNING *;
    `,
      [newVote, comment_id]
    );
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
};
