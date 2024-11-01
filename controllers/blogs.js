require('express-async-errors');
const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const { tokenExtractor, userExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    const searchKeyword = `%${req.query.search}%`;

    const matchingUsers = await User.findAll({
      where: {
        name: { [Op.iLike]: searchKeyword },
      },
    });

    const matchingUserIds = matchingUsers.map(user => user.id);

    where[Op.or] = [
      { title: { [Op.iLike]: searchKeyword } },
      { user_id: { [Op.in]: matchingUserIds } },
    ];
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
    where,
  });

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

  const newBlog = await Blog.create({
    title,
    url,
    likes: likes || 0,
    user_id: req.user.id,
  });

  res.status(201).json(newBlog);
});

router.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findByPk(id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (blog.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Unauthorized: You can only delete your own blogs' });
  }

  await blog.destroy();
  res.status(204).end();
  console.log('Blog deleted');
});

module.exports = router;
