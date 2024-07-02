const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Importa la instancia de Sequelize
const ubicacion = require('./ubicacion');
const fruta = require('./fruta');




const bines = sequelize.define('bines', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lugar_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ubicacion,
        key: 'id',
      }
    },
    fruta_id: {
      type: DataTypes.INTEGER,
      references: {
        model: fruta,
        key: 'id',
      }
    },   
    fecha: { 
        type: DataTypes.DATE,
        allowNull: false,
      },   
    estado: {
    type: DataTypes.ENUM('1', '80%', '50%', '30%'),
    allowNull: false
    }
  },{
    sequelize,
    modelName: 'bines',
    tableName: 'bines',
  });

// Asociaciones

module.exports = bines;
