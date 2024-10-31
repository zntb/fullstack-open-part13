const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { USER_PASSWORD, SECRET } = require('../util/config');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user || password !== USER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
  res.status(200).json({ token });
});

module.exports = router;
