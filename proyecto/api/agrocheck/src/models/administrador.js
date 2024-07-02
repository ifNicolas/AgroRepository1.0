
const {Sequelize,DataTypes} = require('sequelize');

const sequelize = new Sequelize('agrodb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    } 
});

const administrador = sequelize.define('administrador', {
    rut_administrador:{
        type:DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
        unique: true
    },
    nombre_administrador: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'administrador'
    },  
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Activa'
    }

  },{
    sequelize,
    modelName: 'administrador',
    tableName: 'administrador',
  });

  module.exports = administrador;