require('express-async-errors');
const router = require('express').Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required.' });
  }

  const newUser = await User.create({ name, username });
  res.status(201).json(newUser);
});

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
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
