const db = require('../db/connection');

exports.deleteFromByCommentId = async(comment_id) => {
    const result = await db.query(
        `
        DElETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
        `,
        [comment_id]
    );
    return result.rows[0];
}