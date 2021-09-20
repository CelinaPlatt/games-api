// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData) => {
    const formattedCategories = categoryData.map((user)=>{
        return [user.slug, user.description];
    });
    return formattedCategories;
};

exports.formatUserData = (userData) => {
    const formattedUsers = userData.map((user)=>{
        return [user.username, user.name, user.avatar_url];
    })
    return formattedUsers;
};

exports.formatReviewData = (reviewData) => {
    const formattedReviews = reviewData.map((review)=>{
        return [
            review.title,
            review.review_body,
            review.designer,
            review.review_img_url,
            review.votes,
            review.category,
            review.owner,
            review.created_at
        ];
    })
    return formattedReviews;
};

