// models/User.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Username must be a valid email address.',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: true,
    underscored: true,
  },
);

module.exports = User;
