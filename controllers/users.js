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

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  const readFilter = req.query.read;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: ReadingList,
          as: 'readinglists',
          include: [
            {
              model: Blog,
              as: 'blog',
              attributes: ['id', 'title', 'url', 'likes', 'year'],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (readFilter) {
      const isRead = readFilter === 'true';
      user.readinglists = user.readinglists.filter(
        readingList => readingList.read === isRead,
      );
    }

    res.json(user.readinglists);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching user information.' });
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
