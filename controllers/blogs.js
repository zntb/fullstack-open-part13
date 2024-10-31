const router = require('express').Router();
const { Blog } = require('../models');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching blogs.' });
  }
});

router.post('/', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
