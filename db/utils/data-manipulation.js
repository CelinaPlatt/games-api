// extract any functions you are using to manipulate your data, into this file

const formatData = (data, properties) => {
  const formattedData = data.map((object) => {
    const formattedObject = properties.map((property) => {
      return object[property];
    });
    return formattedObject;
  });
  return formattedData;
};

exports.formatCategoryData = (categoryData) => {
  return formatData(categoryData, ['slug', 'description']);
};

exports.formatUserData = (userData) => {
  return formatData(userData, ['username', 'name', 'avatar_url']);
};

exports.formatReviewData = (reviewData) => {
  return formatData(reviewData, [
    'title',
    'review_body',
    'designer',
    'review_img_url',
    'votes',
    'category',
    'owner',
    'created_at',
  ]);
};

exports.formatCommentData = (commentData) => {
  return formatData(commentData, [
    'author',
    'review_id',
    'votes',
    'created_at',
    'body',
  ]);
};
