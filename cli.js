require('dotenv').config();
const sequelize = require('./db');
const Blog = require('./models/Blog');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Executing (default): SELECT * FROM blogs');

    const blogs = await Blog.findAll();

    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });

    await sequelize.close();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();
