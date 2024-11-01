require('express-async-errors');
const router = require('express').Router();
const { ReadingList } = require('../models');

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  if (!blogId || !userId) {
    return res.status(400).json({ error: 'blogId and userId are required.' });
  }

  const readingListEntry = await ReadingList.create({
    blogId,
    userId,
    read: false,
  });

  res.status(201).json(readingListEntry);
});

module.exports = router;
