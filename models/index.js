const Blog = require('./Blog');
const User = require('./User');
const ReadingList = require('./ReadingList');

User.hasMany(Blog, { as: 'authoredBlogs', foreignKey: 'userId' });
Blog.belongsTo(User, { as: 'author', foreignKey: 'userId' });

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readings',
  foreignKey: 'userId',
  otherKey: 'blogId',
});
Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers',
  foreignKey: 'blogId',
  otherKey: 'userId',
});

module.exports = {
  Blog,
  User,
  ReadingList,
};
