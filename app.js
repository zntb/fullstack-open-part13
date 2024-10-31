require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const Blog = require('./models/Blog');

const app = express();
app.use(express.json());

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching blogs.' });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { author, url, title, likes } = req.body;
  if (!url || !title) {
    return res.status(400).json({ error: 'URL and title are required.' });
  }

  try {
    const newBlog = await Blog.create({ author, url, title, likes });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the blog.' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCount = await Blog.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(204).send();
    console.log(`Blog with id ${id} deleted.`);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the blog.' });
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
