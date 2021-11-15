const { readEndpointsJson } = require('../models/api-index.models.js');

exports.getApiEndpoints = async (req, res, next) => {
  try {
    const endpointsIndexData = await readEndpointsJson();
    res.status(200).send({
      'Welcome to Game Critic API!':
        'Please find below the available end points with their corresponding request and response example',
      endpoints: endpointsIndexData,
    });
  } catch (err) {
    next(err);
  }
};
