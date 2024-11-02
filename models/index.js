const Blog = require('./Blog');
const User = require('./User');
const Session = require('./Session');
const ReadingList = require('./ReadingList');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readinglists' });

User.hasMany(ReadingList, { foreignKey: 'user_id' });
ReadingList.belongsTo(User, { foreignKey: 'user_id' });
Blog.hasMany(ReadingList, { foreignKey: 'blog_id' });
ReadingList.belongsTo(Blog, { foreignKey: 'blog_id' });

Session.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Session, { foreignKey: 'userId' });

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
