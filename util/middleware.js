const logger = require('./logger');

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
    return res
      .status(400)
      .send({ error: 'Validation error: Please check the data provided.' });
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res
      .status(500)
      .json({ error: 'An error occurred while accessing the database.' });
  }

  res.status(500).json({ error: 'An internal server error occurred.' });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
