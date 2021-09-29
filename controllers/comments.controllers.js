const {
  deleteFromByCommentId,
  updateCommentById,
} = require('../models/comments.models');
const { patchReviewById } = require('./reviews.controllers');

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
  const { inc_votes } = req.body;
  try {
    const patchedCommentData = await updateCommentById(comment_id, inc_votes);
    res.status(200).send({ comment: patchedCommentData });
  } catch (err) {
    next(err);
  }
};
