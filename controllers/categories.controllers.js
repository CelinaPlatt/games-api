const { fetchCategories } = require('../models/categories.models');

exports.getCategories = async (req, res, next) => {
  try {
    const categoriesData = await fetchCategories();
    res.status(200).send({ categories: categoriesData });
  } catch (err) {
    next(err);
  }
};
