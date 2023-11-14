CREATE TABLE IF NOT EXISTS `LoginNew` (
  `cc_persona` varchar(20) NOT NULL,
  `nombres_persona` varchar(50) NOT NULL,
  `apellidos_persona` varchar(50) NOT NULL,
  `id_empresa` int(2) NOT NULL, -- 1: Multired 2: Servired 3: Multired y Servired
  `id_cargo` int(2) NOT NULL, -- 
  `id_proceso` int(2) NOT NULL, -- 
  `id_rol` int(1) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `id_estado` int(1) NOT NULL,
  PRIMARY KEY (`cc_persona`),
  KEY `id_proceso` (`id_proceso`),
  KEY `id_cargo` (`id_cargo`),
  KEY `id_empresa` (`id_empresa`),
  KEY `id_estado` (`id_estado`),
  KEY `id_rolLogin` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;