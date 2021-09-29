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

const formatCategoryData = (categoryData) => {
  return formatData(categoryData, ['slug', 'description']);
};

const formatUserData = (userData) => {
  return formatData(userData, ['username', 'name', 'avatar_url']);
};

const formatReviewData = (reviewData) => {
  const formattedTimeStampData = reviewData.map((review) => {
    return formatTimeStamp(review);
  });
  const formattedData = formatData(formattedTimeStampData, [
    'title',
    'review_body',
    'designer',
    'review_img_url',
    'votes',
    'category',
    'owner',
    'created_at',
  ]);
  return formattedData;
};

const formatTimeStamp = (object) => {
  const copyObject = { ...object };
  const timeStampStr = copyObject.created_at.toISOString();
  const formattedTimeStamp = timeStampStr.replaceAll(/[TZ]/g, ' ').trim();
  copyObject.created_at = formattedTimeStamp;
  return copyObject;
};

const formatCommentData = (commentData) => {
  return formatData(commentData, [
    'author',
    'review_id',
    'votes',
    'created_at',
    'body',
  ]);
};

module.exports = {
  formatData,
  formatCategoryData,
  formatUserData,
  formatReviewData,
  formatTimeStamp,
  formatCommentData,
};
