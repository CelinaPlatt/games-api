// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData)=>{
  const formattedCategories = categoryData.map((user)=>{
      return [user.slug,user.description];
  })
  return formattedCategories;
}