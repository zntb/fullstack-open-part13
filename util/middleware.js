const logger = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { User } = require('../models');

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

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
