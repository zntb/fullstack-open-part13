const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Blog = sequelize.define(
  'Blog',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    author: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'blogs',
    timestamps: false,
  },
);

module.exports = Blog;
