require('express-async-errors');
const router = require('express').Router();
const { Blog } = require('../models');
const { tokenExtractor, userExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
  const { url, title, likes } = req.body;

  if (!url || !title) {
    return res.status(400).send({ error: 'URL and title are required.' });
  }

  if (!req.user) {
    return res.status(401).send({ error: 'Unauthorized: Please log in.' });
  }

  try {
    const newBlog = await Blog.create({
      title,
      url,
      likes,
      user_id: req.user.id,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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
