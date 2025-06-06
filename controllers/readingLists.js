require('express-async-errors');
const router = require('express').Router();
const { ReadingList } = require('../models');
const {
  tokenExtractor,
  userExtractor,
  sessionValidator,
} = require('../util/middleware');

router.get(
  '/',
  tokenExtractor,
  userExtractor,
  sessionValidator,
  async (req, res) => {
    const userId = req.user.id;

    const { read } = req.query;

    const where = { userId };

    if (read) {
      where.read = read === 'true';
    }

    const readingListEntries = await ReadingList.findAll({
      where,
    });

    res.json(readingListEntries);
  },
);

router.post(
  '/',
  tokenExtractor,
  userExtractor,
  sessionValidator,
  async (req, res) => {
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
  },
);

router.put(
  '/:id',
  tokenExtractor,
  userExtractor,
  sessionValidator,
  async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;

    const readingListEntry = await ReadingList.findByPk(id);
    console.log(readingListEntry);

    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list not found' });
    }

    if (readingListEntry.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Unauthorized: You can only update your own reading lists',
      });
    }

    readingListEntry.read = read;
    await readingListEntry.save();

    res.json(readingListEntry);
  },
);

module.exports = router;
