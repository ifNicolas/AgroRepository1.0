const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('agrodb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  }
});

module.exports = sequelize;