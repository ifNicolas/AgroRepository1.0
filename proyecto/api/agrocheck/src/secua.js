//require express
const express = require('express');
const session = require('express-session');
const app = express();
const QRCode = require('qrcode');
const cors = require('cors')
const { v4: uuid } = require('uuid');

//importaciones modelos
//usuarios
const operador = require('./models/operador');
const administrador = require('./models/administrador');
const cosechador = require('./models/cosechador');
//end usuarios
//modelos 
const fruta = require('./models/fruta');
const ubicacion = require('./models/ubicacion');
const entrega = require('./models/entrega');
const bines = require('./models/bines');
const qrModel = require('./models/qr');
//coneccion express
app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud
const port = 3000; // Puedes usar el puerto que prefieras
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
//coneccion sequalize
const { Sequelize, DataTypes, Op } = require('sequelize');



const sequelize = new Sequelize('agrodb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    } 
});
async function authenticateDatabase() {
    try {
        await sequelize.authenticate();
        console.log('La conexión ha sido establecida exitosamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}
authenticateDatabase();
//coneccion por sesion 
app.use(session({
    secret: 'sin secretos',
    resave: false, 
    saveUninitialized: false, 
       cookie: {
      maxAge: 60 * 60 * 1000, // una hora
      secure: false, // 
    }
  }));
//use cors
app.use(cors());
//login 
app.post('/api/login/administrador', async (req, res) => {
    const { rut, password } = req.body;
    
    // Intenta encontrar al administrador
    let user = await administrador.findOne({ where: { rut_administrador: rut, contraseña: password } });
    
    if (user) {
      req.session.user = user.dataValues; // Guardar el usuario en la sesión
      req.session.user.role = user.dataValues.rol_user; // Guardar el rol del usuario en la sesión
      res.send({ message: 'Inicio de sesión exitoso', user: req.session.user });
    } else {
      res.status(401).send({ message: 'RUT o contraseña incorrectos' });
    }
  });
  
  app.post('/api/login/operador', async (req, res) => {
    const { rut, password } = req.body;
    
    // Intenta encontrar al operador
    let user = await operador.findOne({ where: { rut_operador: rut, contraseña: password } });
    
    if (user) {
      req.session.user = user.dataValues; // Guardar el usuario en la sesión
      req.session.user.role = user.dataValues.rol_user; // Guardar el rol del usuario en la sesión
      res.send({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).send({ message: 'RUT o contraseña incorrectos' });
    }
  });
  
  app.post('/api/login/cosechador', async (req, res) => {
    const { rut } = req.body;
    
    // Intenta encontrar al cosechador
    let user = await cosechador.findOne({ where: { rut_cosechador: rut } });
    
    if (user) {
      req.session.user = user.dataValues; // Guardar el usuario en la sesión
      req.session.user.role = user.dataValues.rol_user; // Guardar el rol del usuario en la sesión
      res.send({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).send({ message: 'RUT incorrecto' });
    }
  });
  
  //loogut
  
  app.post('/api/logout', (req, res) => {
    if(!session){
        res.send({message: session.user.dataValues})
    }
    req.session.destroy(); // Destruir la sesión
    res.send({ message: 'Cierre de sesión exitoso' });
  });


//crud operadores : tabla : operador

app.get('/api/buscarOperadores', async(req, res) => {

try {
    const operadores = await operador.findAll();
        res.send(operadores);
} catch(error){
        res.status(500).send(error);
}
});

app.post('/api/crearOperador', async (req, res) => {
    try {
        const nuevoOperador = await operador.create(req.body);
        res.json(nuevoOperador);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/crearCosechador', async (req, res) => {
    try {
        const nuevoCosechador = await cosechador.create(req.body);
        res.json(nuevoCosechador);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.delete('/api/eliminarOperador/:rut', async(req,res)=>{
    try{
        await operador.destroy({
            where:{
                rut_operador:req.params.rut
            }
        });
        res.send({message:'operador eliminado con exito'});
    }catch(error) {
        res.status(500).send(error);
    }
});

app.put('/api/actualizarOperador/:rut', async(req,res)=>{
    try{
        await operador.update(req.body, {
            where:{
                rut_operador:req.params.rut
            }
        });
        res.send({message:'operador actualizado con exito'});
    }catch(error) {
        res.status(500).send(error);
    }
});
//barra de busqueda operador
app.get('/api/barraBusquedaOperador', async (req, res) => {
    try {
        const { busqueda } = req.query;
        
        const resultados = await operador.findAll({
            where: {
                [Op.or]: [
                    { rut_operador: { [Op.like]:  busqueda.trim() + '%' } },
                    { nombre_operador: { [Op.like]:  busqueda.trim() + '%' } },
                    { estado: { [Op.like]: busqueda.trim() + '%' } }
                ]
            }
        });
        
        res.json(resultados);
    } catch (error) {
        res.status(500).send(error);
    }
});


//Crud fruta , tabla :fruta
app.get('/api/buscarFrutas', async(req,res)=>{
    try{
        const frutas = await fruta.findAll();
        res.send(frutas)
    }catch(error) {
        res.status(500).send(error)

    }
});

app.post('/api/crearFruta', async(req,res)=>{
    try{
        const nuevaFruta = await fruta.create(req.body);
        res.json(nuevaFruta)
    }catch(error){
        res.status(500).send(error);
    }
});
//eliminar por id
app.delete('/api/eliminarFruta/:id', async (req,res)=>{
    try{
        await fruta.destroy({
            where:{
                id:req.params.id
            } 
        });
        res.send({message:'fruta eliminada con exito'});
    }catch(error) {
        res.status(500).send(error);
    }
});
app.put('/api/actualizarFruta/:id',async(req,res)=>{
    try{
        await fruta.update(req.body, {
            where:{
                id:req.params.id
            }
        });
        res.send({message:'fruta actualizada con exito'});
    }catch(error){
        res.status(500).send(error);
    }
});
//barra de busqueda fruta
app.get('/api/barraBusquedaFruta',async(req,res)=>{
    try{
        const {busqueda}=req.query;
   
        const resultado = await fruta.findAll({
            where: {
                [Op.or]:[{nombre_fruta:{ [Op.like]: busqueda.trim() + '%' }}]
            }
        });
        res.json(resultado);
    }catch(error){
        res.status(500).send(error);
    }
});

//crud ubicaciones
app.get('/api/buscarUbicaciones', async(req,res)=>{
    try{
        const ubicaciones = await ubicacion.findAll(); 
        res.json(ubicaciones);
    }catch(error) {
        res.status(500).send(error);

    }
});

app.post('/api/crearUbicacion',async(req,res)=>{
    try{
        const nuevaUbicacion = await ubicacion.create(req.body);
        res.json(nuevaUbicacion);
    }catch(error){
        res.status(500).send(error);
    }
});
app.delete('/api/eliminarUbicacion/:id',async(req,res)=>{
    try{
        await ubicacion.destroy({
            where:{
                id:req.params.id
            }
        })
        res.send({message:'ubicacion eliminada con exito'})
    }catch(error){
        send.status(500).send(error);
    }
})
app.put('/api/actualizarUbicacion/:id', async(req,res)=>{
    try{
        await ubicacion.update(req.body, {
            where:{
                id:req.params.id
            }
        });
        res.send({message:'ubicacion actualizada con exito'});
    }catch(error){
        res.status(500).send(error);
    }
})

//barra busqueda ubicacion
app.get('/api/barraBusquedaUbicacion',async(req,res)=>{
    try{
        const {busqueda}=req.query;
   
        const resultado = await ubicacion.findAll({
            where: {
                [Op.or]:[{nombre_sector:{ [Op.like]:'%' + busqueda.trim() + '%' }}
            ]
            }
        });
        res.json(resultado);
    }catch(error){
        res.status(500).send(error);
    }
});
//
//Control de bines
app.get('/api/buscarBines', async(req, res) => {

    try {
        const resultados = await bines.findAll();
           
            res.send(resultados);
    } catch(error){
            res.status(500).send(error);
    }
    });
    
app.post('/api/ingresarBines', async(req, res) => {
    try {
        const nuevoBin = await bines.create(req.body);
        res.status(201).send(nuevoBin);
    } catch(error) {
        res.status(500).send(error);
    }
});
//filtrado de bines
app.get('/api/filtroBines', async (req, res) => {
    try {
        const { busqueda } = req.query;

        const resultado = await bines.findAll({
            where: {
                [Op.or]: [
                    { lugar_id: { [Op.like]: busqueda.trim() + '%' } },
                    { fruta_id: { [Op.like]: busqueda.trim() + '%' } },
                    { fecha: { [Op.like]: busqueda.trim() + '%' } },
                    { estado: { [Op.like]: busqueda.trim() + '%' } }
                ]
            },
            include: [ // Agrega esta sección para incluir los nombres correspondientes
                { model: ubicacion, as: 'lugar', attributes: ['nombre_sector'] },
                { model: fruta, as: 'fruta', attributes: ['nombre_fruta'] }
            ]
        });

        // Mapea los resultados para mostrar los nombres en lugar de los IDs
        const resultadosConNombres = resultado.map(item => ({
            id: item.id,
            lugar_nombre: item.lugar.nombre,
            fruta_nombre: item.fruta.nombre,
            fecha: item.fecha,
            estado: item.estado
        }));

        res.json(resultadosConNombres);
    } catch (error) {
        res.status(500).send(error);
    }
});

    

//control de usuarios

//midelaware  -> este lo utilizare para ver los roles
function checkRole(role){
    return function(req, res, next){
        if(req.user.role === role){
            next(); // si el rol = usuarios -> siguiente funcion
        }else{
            res.status(403).send('Acceso denegado');// si es !user = erro 403
        }
    }
}
//utilidades operador

/**ruta entregas */
app.post('/api/ingresarEntrega', async (req, res) => {
    const { qrCode, cantidad } = req.body;
  
    // Verificar si el operador está autenticado
    if (!req.session.user || req.session.user.role !== 'operador') {
      return res.status(401).send({ message: 'Debes iniciar sesión como operador para ingresar una entrega' });
    }
  
    // Buscar al cosechador por el código QR
    const cosechadorEncontrado = await cosechador.findOne({ where: { qr_code: qrCode } });
    if (!cosechadorEncontrado) {
      return res.status(404).send({ message: 'Cosechador no encontrado' });
    }
  
    // Crear la entrega
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const Entrega = await entrega.create({ fecha: fechaActual, cantidad, rut_cosechador: cosechadorEncontrado.rut_cosechador });

    res.send({ message: 'Entrega ingresada exitosamente', Entrega });
});

//utilidades cosechador


// Obtener la cantidad total de entregas de cada cosechador por día
app.get('/api/entregasPorDia', async (req, res) => {
    const entregas = await entrega.findAll({
        attributes: ['rut_cosechador', [sequelize.fn('date', sequelize.col('fecha')), 'fecha'], [sequelize.fn('sum', sequelize.col('cantidad')), 'total']],
        group: ['rut_cosechador', 'fecha']
    });
    
    res.json(entregas);
});


// Calcular el rendimiento entre semanas
app.get('/api/rendimientoSemanal', async (req, res) => {
    // Verificar si el cosechador está autenticado
    if (!req.session.user || req.session.user.role !== 'cosechador') {
      return res.status(401).send({ message: 'Debes iniciar sesión como cosechador para ver el rendimiento' });
    }

    // Obtener la fecha actual y la fecha de inicio de la semana
    const ahora = new Date();
    const inicioSemana = new Date();
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    const inicioSemanaPasada = new Date();
    inicioSemanaPasada.setDate(inicioSemana.getDate() - 7);

    // Calcular las entregas de esta semana y la semana pasada
    const entregasEstaSemana = await entrega.count({ 
        where: { 
            rut_cosechador: req.session.user.rut_cosechador,
            fecha: {
                [Op.gte]: inicioSemana
            }
        } 
    });
    const entregasSemanaPasada = await entrega.count({ 
        where: { 
            rut_cosechador: req.session.user.rut_cosechador,
            fecha: {
                [Op.between]: [inicioSemanaPasada, inicioSemana]
            }
        } 
    });

    // Calcular el rendimiento
    const rendimiento = ((entregasEstaSemana - entregasSemanaPasada) / entregasSemanaPasada) * 100;

    res.send({ message: `El rendimiento entre esta semana y la semana pasada es del ${rendimiento}%` });
});

// Función para generar un identificador único
function generateIdentifier() {
    // Implementar la lógica para generar un identificador único (por ejemplo, contador, cadena aleatoria)
    return identifier;
  }
  
  app.get('/api/generateQR/:cantidad', async (req, res) => {
    try {
      const cantidad = parseInt(req.params.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).send('Cantidad inválida');
      }
  
      const qrCodes = [];
      const qrCodesFolder = './qr_codes/'; // Ajustar la ruta según el proyecto
  
      // Define the generateIdentifier function
      function generateIdentifier() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let identifier = '';
        for (let i = 0; i < 10; i++) { // Generate 10-character identifiers
          identifier += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return identifier;
      }
  
      for (let i = 0; i < cantidad; i++) {
        const identifier = generateIdentifier(); // Call the function here
        const url = `http://localhost:3000/qrcode/${identifier}`;
        const qrCodeImage = await QRCode.toFile(`${qrCodesFolder}qr_${identifier}.png`, url);
  
        // Almacenar los datos en la base de datos (usando Sequelize)
        await qrModel.create({
          rut_asociado: null, // Ajustar según las necesidades
          estado: 'Activo',
          qr_code_identifier: identifier, // Usar el identificador como identificador único
          qr_code: url, // Almacenar la URL construida
          qr_path: `${qrCodesFolder}qr_${identifier}.png`, // Ruta del archivo generado
        });
  
        qrCodes.push({ identifier, url }); // Devolver el identificador y la URL en la respuesta
      }
  
      res.json({ qrCodes });
    } catch (err) {
      console.error('Error generando códigos QR:', err);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  
  