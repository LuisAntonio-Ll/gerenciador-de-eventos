const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Registration = sequelize.define('Registration', {
  participantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Registration;
