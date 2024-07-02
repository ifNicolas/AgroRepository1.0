const { DataTypes , Model} = require('sequelize');
const sequelize = require('./sequelize'); // Importa la instancia de Sequelize
const bines = require('./bines');




class ubicacion extends Model {}

ubicacion.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_sector: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ubicacion',
    tableName: 'ubicacion',
});

// ubicacion.hasMany(bines, { foreignKey: 'lugar_id', as: 'lugar_id' });

module.exports = ubicacion;
