require('express-async-errors');
const router = require('express').Router();
const { User, Blog, ReadingList } = require('../models');

router.post('/', async (req, res) => {
  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required.' });
  }

  const newUser = await User.create({ name, username });
  res.status(201).json(newUser);
});

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Blog, attributes: ['title', 'url', 'likes'] }],
  });
  res.json(users);
});

router.get('/:id', async (req, res, next) => {
  const where = {};
  if (req.query.read) {
    where.read = req.query.read;
  }
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          as: 'readinglists',
          attributes: {
            exclude: ['userId', 'blogId', 'createdAt', 'updatedAt'],
          },
          where,
        },
      },
    ],
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required.' });
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  user.username = newUsername;
  await user.save();

  res.json(user);
});

module.exports = router;
