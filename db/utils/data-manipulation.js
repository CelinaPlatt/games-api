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

// format time stamp inside for each review property inside format Data
// exports.formatTimeStamp = (timeStamp) => {

//   const timeStampStr = timeStamp.toISOString();
//   const formattedTimeStamp = timeStampStr.replaceAll(/[TZ]/g,' ').trim();
//   return formattedTimeStamp;
// };

exports.formatTimeStamp = (object) => {
  const copyObject = {...object};
  const timeStampStr = copyObject.created_at.toISOString();
  const formattedTimeStamp = timeStampStr.replaceAll(/[TZ]/g,' ').trim();
  copyObject.created_at = formattedTimeStamp;
  return copyObject;
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
