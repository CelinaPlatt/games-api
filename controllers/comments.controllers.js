const {
  deleteFromByCommentId,
  updateCommentById,
} = require('../models/comments.models');

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await deleteFromByCommentId(comment_id);
    res.status(204).send({});
  } catch (err) {
    next(err);
  }
};

exports.patchCommentById = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, body } = req.body;
  try {
    const patchedCommentData = await updateCommentById(
      comment_id,
      inc_votes,
      body
    );
    if (patchedCommentData) {
      res.status(200).send({ comment: patchedCommentData });
    } else {
      await Promise.reject({ status: 404, msg: 'Not Found' });
    }
  } catch (err) {
    next(err);
  }
};
