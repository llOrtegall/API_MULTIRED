create database datauser;

use datauser;
use clientes;

CREATE TABLE IF NOT EXISTS `login` (
  `id` BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `login`(`username`, `password`, `nombres`, `apellidos`) VALUES (
	'CP1118307852', 'CP852', 'Ivan', 'Ortega Garzon'
);

CREATE TABLE IF NOT EXISTS `cliente` (
  `tipodecliente` int(2) NOT NULL DEFAULT(1), `tipodocumento` int(10) NOT NULL, `cedula` int(15) NOT NULL, `fechaexpedicion` date NOT NULL,
  `lugarexpedición` varchar(30) DEFAULT('Yumbo'), `documentoAlterno` int(10) NOT NULL, `nombre1` varchar(30) NOT NULL, `nombre2` varchar(30),
  `apellido1` varchar(10) NOT NULL, `apellido2` varchar(30) , `fechanacimiento` date NULL, `telefono` int(30),  `Dirección` varchar(255) DEFAULT('Cr 4 # 4-51 B/Belalcazar'),
  `sexo` int(10) DEFAULT 1, `numerofavorito` int(10), `totalpunto`int(10), `departamento` varchar(255) DEFAULT('Valle'), `municipio` varchar(255) DEFAULT ('Yumbo'),
  `nacionalidad` varchar(255) DEFAULT ('Colombiana'), `correo` varchar(255) NOT NULL, `numerocelular` int(25), `aceptapolicita` int(2) NOT NULL DEFAULT(1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `personayumbo` (
  `cedula` int(15) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `correo` varchar(30) NOT NULL,
  `telwhats` varchar(14) DEFAULT NULL,
  `fregistro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `personayumbo` (`cedula`, `nombre`, `telefono`, `correo`, `telwhats`, `fregistro`) VALUES (1118307852, 'Ivan Ortega Garzón', '3202191681', 'IvanOrtega_97@hotmail.com', '573174420518', '2023-09-18');

SELECT * FROM personayumbo;
SELECT * FROM cliente;
SELECT * FROM login;

SELECT username, password FROM login WHERE username = 'CP1118307852';

INSERT INTO `cliente` ( 
  `tipodecliente`, `tipodocumento`, `cedula`,  `fechaexpedicion`, `lugarexpedición`, `documentoAlterno`,
  `nombre1`, `nombre2`, `apellido1`, `apellido2`, `fechanacimiento`, `telefono`, `Dirección`, `sexo`, `numerofavorito`, `totalpunto`, `departamento`, `municipio`,
  `nacionalidad`, `correo`, `numerocelular`, `aceptapolicita`  
  ) VALUES(1, 1, 0001, '2015-02-09', 'Restrepo', 00001, 'Ivan', 'Marino', 'Ortega', 'Garzon', '1997-01-19', 
	1234123, 'ejemplo Calle', 10, 234, 0, 'Valle', 'Yumbo', 'Colomb', 'cooreo@corre.com', 1118307852, 1);
    
INSERT INTO `cliente` ( 
  `tipodecliente`, `tipodocumento`, `cedula`,  `fechaexpedicion`, `lugarexpedición`, `documentoAlterno`,
  `nombre1`, `nombre2`, `apellido1`, `apellido2`, `fechanacimiento`, `telefono`, `Dirección`, `sexo`, `numerofavorito`, `totalpunto`, `departamento`, `municipio`,
  `nacionalidad`, `correo`, `numerocelular`, `aceptapolicita`  
  ) VALUES(1, 1, 0001, '2015-02-09', 'Cali', 1192770095, 'Carlos', 'Mauricio', 'Orejuela', 'Castro', '1995-01-19', 
	1231513, 'ejemplo Calle', 10, 234, 0, 'Valle', 'Yumbo', 'Colomb', 'ccarlos@corre.com', 1118307852, 1);