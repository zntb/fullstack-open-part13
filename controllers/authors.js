require('express-async-errors');
const router = require('express').Router();
const { User, Blog } = require('../models');
const { sequelize } = require('../util/db');

router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        [sequelize.col('user.name'), 'author'],
        [sequelize.fn('COUNT', sequelize.col('blog.id')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
      include: [
        {
          model: User,
          attributes: [],
          required: true,
        },
      ],
      group: ['user.id'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
    });

    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

module.exports = router;
