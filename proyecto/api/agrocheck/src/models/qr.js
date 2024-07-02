const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Importa la instancia de Sequelize
const cosechador = require('./cosechador'); // Importa el modelo cosechador

const qr = sequelize.define('qr', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rut_asociado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: cosechador,
      key: 'rut_cosechador',
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Inactivo'
  },
  qr_code: {
    type: DataTypes.STRING, // Tipo UUID para el código único
    allowNull: false,
    unique: true // Garantizar que el código QR sea único
  },
  qr_path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'qr',
  tableName: 'qr',
});

// Asociaciones
qr.belongsTo(cosechador, { foreignKey: 'rut_asociado' }); // Asociación uno a muchos

module.exports = qr;
