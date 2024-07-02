USE agrocheck_db;
-- //ubicacion y fruta

CREATE TABLE IF NOT EXISTS Ubicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sector VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Fruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_fruta VARCHAR(255) NOT NULL
);
-- operadores
CREATE TABLE IF NOT EXISTS Operador (
    rut_operador VARCHAR(10) PRIMARY KEY,
    contraseña VARCHAR(255) NOT NULL,
    estado ENUM('Activa', 'Inactiva') NOT NULL DEFAULT 'Activo'
);

CREATE TABLE IF NOT EXISTS Administrador (
    rut VARCHAR(10) PRIMARY KEY,
    contraseña VARCHAR(255) NOT NULL,
    estado ENUM('Activa', 'Inactiva') NOT NULL
);

CREATE TABLE IF NOT EXISTS Cosechador (
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR(10) PRIMARY KEY,
    qr_code VARCHAR(255) NOT NULL,
    estado ENUM('Activo', 'Inactiva') NOT NULL DEFAULT 'Activo'
);


CREATE TABLE IF NOT EXISTS Cosecha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cosechador VARCHAR(255),
    fecha DATE,
    cantidad INT,
    FOREIGN KEY (nombre_cosechador) REFERENCES Cosechador(nombre)
);
CREATE TABLE IF NOT EXISTS Labor_diario(
`id` int NO NULL AUTO_INCREMENT,
  fecha DATE NO NULA,
  rut_operador varchar(10) POR DEFECTO NULO,
  id_fruta int DEFAULT NULL,
  id_ubicacion int DEFAULT NULL,
  FOREIGN KEY (rut_operador) REFERENCES Operador(rut_operador)
  FOREIGN KEY (id_fruta) REFERENCES Fruta(nombre)
  FOREIGN KEY (nombre_cosechador) REFERENCES Cosechador(nombre)
);

CREATE TABLE IF NOT EXISTS Bines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lugar VARCHAR(255),
    fecha DATE,
    estado ENUM('1', '80%', '50%', '30%'),
    fruta VARCHAR(255)
     FOREIGN KEY (lugar) REFERENCES Ubicacion(nombre_sector)
     FOREIGN KEY (fruta) REFERENCES Fruta(nombre_fruta)
);







-- anexos


CREATE TABLE IF NOT EXISTS QR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut_asociado VARCHAR(10),
    estado ENUM('Activo', 'Inactivo', 'Eliminado'),
    FOREIGN KEY (rut_asociado) REFERENCES Cosechador(rut)
);

CREATE TABLE IF NOT EXISTS Eficiencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cosechador VARCHAR(255),
    fecha DATE,
    eficiencia FLOAT,
    FOREIGN KEY (nombre_cosechador) REFERENCES Cosechador(nombre)
);

CREATE TABLE IF NOT EXISTS Tendencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    rendimiento FLOAT,
    eficiencia FLOAT
);

CREATE TABLE IF NOT EXISTS Informe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('Eficiencia', 'Tendencia'),
    formato ENUM('PDF', 'CSV'),
    fecha_generado DATE
);
