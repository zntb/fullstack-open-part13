const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1991,
          msg: 'Year must be at least 1991.',
        },
        max: {
          args: new Date().getFullYear(),
          msg: `Year cannot exceed the current year (${new Date().getFullYear()}).`,
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'blog',
    timestamps: true,
    underscored: true,
  },
);

module.exports = Blog;
