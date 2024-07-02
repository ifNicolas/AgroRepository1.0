const { Sequelize, DataTypes } = require('sequelize');
const cosechador = require('./cosechador');

const sequelize = new Sequelize('agrodb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
      timestamps: false,
  } 
});

const entrega = sequelize.define('entrega', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rut_cosechador: {
      type: DataTypes.STRING,
      references: {
        model: cosechador,
        key: 'rut_cosechador',
      }
    },   
    fecha: { 
        type: DataTypes.DATE,
        allowNull: false,
      }
  },{
    sequelize,
    modelName: 'entrega',
    tableName: 'entrega',
  });
  //sinconnizacion db
   sequelize.sync()
   .then(() => console.log('Base de datos y tablas creadas'))
//   .catch(error => console.log(error));

  module.exports = entrega;
