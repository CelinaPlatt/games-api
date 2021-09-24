exports.handle404Errors = (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500errors = (err, req, res, next) => {
  console.log(err, '<<< unhandled error');
  res.status(500).send({ msg: 'Internal Server Error' });
}