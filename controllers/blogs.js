require('express-async-errors');
const router = require('express').Router();
const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const { author, url, title, likes } = req.body;

  if (!url || !title) {
    throw new Error('URL and title are required.');
  }

  const newBlog = await Blog.create({ author, url, title, likes });
  res.status(201).json(newBlog);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  if (typeof likes !== 'number') {
    throw new Error('Likes must be a number.');
  }

  const blog = await Blog.findByPk(id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found.' });
  }

  blog.likes = likes;
  await blog.save();

  res.json(blog);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Blog.destroy({ where: { id } });

  if (deletedCount === 0) {
    return res.status(404).json({ error: 'Blog not found.' });
  }
  res.status(204).send();
  console.log(`Blog with id ${id} deleted.`);
});

module.exports = router;
