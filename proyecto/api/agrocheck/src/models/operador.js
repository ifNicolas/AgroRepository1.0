const { Sequelize, DataTypes , Model} = require('sequelize');


const sequelize = new Sequelize('agrodb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    } 
});

class operador extends Model {}

operador.init({
    rut_operador: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    nombre_operador: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'operador'
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Activa'
    }
}, {
    sequelize,
    modelName: 'operador',
    tableName: 'operador',
});

module.exports = operador;
