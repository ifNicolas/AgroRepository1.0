
const {Sequelize,DataTypes} = require('sequelize');

const sequelize = new Sequelize('agrodb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    } 
});



const cosechador = sequelize.define('cosechador', {
    rut_cosechador:{
        type:DataTypes.STRING,
        allowNull: false,
        primaryKey:true,
        unique: true
    },
    nombre_cosechador: {
      type: Sequelize.STRING,
      allowNull: false,
    },  
    qr_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    rol_user: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'cosechador'
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Activa'
    }
    

  },{
    sequelize,
    modelName: 'cosechador',
    tableName: 'cosechador',
    });
  
    // sequelize.sync()
    // .then(() => console.log('Base de datos y tablas creadas'))
    // .catch(error => console.log(error));
  

  module.exports = cosechador;