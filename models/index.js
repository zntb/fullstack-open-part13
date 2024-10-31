const Blog = require('./Blog');
const User = require('./User');

const syncModels = async () => {
  await User.sync({ force: true });
  console.log('Users table synced');
  await Blog.sync({ force: true });
  console.log('Blogs table synced');
};

syncModels().catch(error => console.error('Error syncing models:', error));

User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
};
