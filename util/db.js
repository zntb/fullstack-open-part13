const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  rejectUnauthorized: false,
  logging: false,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected successfully');
  } catch (error) {
    console.log('Unable to connect to the database:', error);
    return process.exit(1);
  }

  return null;
};

module.exports = { sequelize, connectToDatabase };