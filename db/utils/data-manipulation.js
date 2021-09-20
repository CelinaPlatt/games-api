// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData) => {
    const formattedCategories = categoryData.map((user)=>{
        return [user.slug,user.description];
    });
    return formattedCategories;
};

exports.formatUserData = (userData) => {
    const formattedUsers = userData.map((user)=>{
        return [user.username,user.name,user.avatar_url];
    })
    return formattedUsers;
};