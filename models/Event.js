const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
});

module.exports = Event;
