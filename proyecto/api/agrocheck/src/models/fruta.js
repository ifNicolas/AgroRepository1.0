const {  DataTypes , Model} = require('sequelize');
const bines = require('./bines');
const sequelize = require('./sequelize'); // Importa la instancia de Sequelize


class fruta extends Model {}

fruta.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_fruta: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'fruta',
    tableName: 'fruta',
});

module.exports = fruta;
