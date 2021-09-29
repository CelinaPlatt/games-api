const { deleteFromByCommentId } = require('../models/comments.models');

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await deleteFromByCommentId(comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
