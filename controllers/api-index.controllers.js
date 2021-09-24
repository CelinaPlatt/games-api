const { readEndpointsJson } = require('../models/api-index.modelsjs');

exports.getApiEndpoints = async (req, res, next) => {
  try {
    const endpointsIndexData = await readEndpointsJson();
    res.status(200).send({ endpoints: endpointsIndexData });
  } catch (err) {
    next(err);
  }
};
