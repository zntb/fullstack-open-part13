const logger = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { User, Session } = require('../models');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    const validationErrors = error.errors.map(err => err.message);
    return res.status(400).json({ error: validationErrors });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .send({ error: 'A user with the same email already exists.' });
  }

  res.status(500).json({ error: 'An internal server error occurred.' });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, SECRET);
    req.user = await User.findByPk(decodedToken.id);
  }
  next();
};

const sessionValidator = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token required' });

    const session = await Session.findOne({ where: { token } });
    if (!session) return res.status(401).json({ error: 'Invalid session' });

    const user = await User.findOne({ where: { id: session.userId } });
    if (user.disabled)
      return res.status(403).json({ error: 'User access disabled' });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Session validation error' });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  sessionValidator,
};
