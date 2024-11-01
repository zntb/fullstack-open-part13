const Blog = require('./Blog');
const User = require('./User');
const ReadingList = require('./ReadingList');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'reading',
});
Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readingList',
});

module.exports = {
  Blog,
  User,
  ReadingList,
};
