require('express-async-errors');
const express = require('express');
const router = express.Router();
const { Session } = require('../models');
const { sessionValidator } = require('../util/middleware');

router.delete('/', sessionValidator, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  const deletedCount = await Session.destroy({ where: { token } });

  if (deletedCount === 0) {
    return res.status(404).json({ error: 'Session not found' });
  }

  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
