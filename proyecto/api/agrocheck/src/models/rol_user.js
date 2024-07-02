const { Sequelize, DataTypes , Model, where,Op } = require('sequelize');

const sequelize = new Sequelize('agrodb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
      timestamps: false,
  } 
});
 
const rol_user = sequelize.define('rol_user', {
    tipo_rol: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });
  module.exports = rol_user;