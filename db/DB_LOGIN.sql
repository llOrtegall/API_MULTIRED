
#Schema para crear tabla
CREATE TABLE login_chat (
  id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  nombres VARCHAR(60) NOT NULL,
  apellidos VARCHAR(60) NOT NULL,
  documento BIGINT NOT NULL UNIQUE,
  telefono BIGINT NOT NULL,
  correo VARCHAR(80) NOT NULL UNIQUE,
  username VARCHAR(60) NOT NULL UNIQUE,
  password VARCHAR(80) NOT NULL,
  password2 VARCHAR(80) DEFAULT NULL,
  estado BOOLEAN DEFAULT TRUE NOT NULL,
  empresa INT DEFAULT 0 CHECK (empresa BETWEEN 0 AND 2), # 0 AMBAS 1 - SERVIRES 2 - MULITRED 
  proceso INT DEFAULT 0 CHECK (proceso BETWEEN 0 AND 9),
  rol VARCHAR(30),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8 COLLATE utf8_general_ci;

# Descripción de la tabla login_chat
+----------------+-------------+------+-----+---------------------+-------------------+
| Field          | Type        | Null | Key | Default             | Extra             |
+----------------+-------------+------+-----+---------------------+-------------------+
| id             | binary(16)  | NO   | PRI | uuid_to_bin(uuid()) | DEFAULT_GENERATED |
| nombres        | varchar(60) | NO   |     | NULL                |                   |
| apellidos      | varchar(60) | NO   |     | NULL                |                   |
| documento      | bigint      | NO   | UNI | NULL                |                   |
| telefono       | bigint      | NO   |     | NULL                |                   |
| correo         | varchar(80) | NO   | UNI | NULL                |                   |
| username       | varchar(60) | NO   | UNI | NULL                |                   |
| password       | varchar(80) | NO   |     | NULL                |                   |
| password2      | varchar(80) | YES  |     | NULL                |                   |
| estado         | tinyint(1)  | NO   |     | 1                   |                   |
| empresa        | int         | YES  |     | 0                   |                   |
| proceso        | int         | YES  |     | 0                   |                   |
| rol            | varchar(30) | YES  |     | NULL                |                   |
| fecha_creacion | timestamp   | YES  |     | CURRENT_TIMESTAMP   | DEFAULT_GENERATED |
+----------------+-------------+------+-----+---------------------+-------------------+

# Inser para tabla
INSERT INTO login_chat_v1 (nombres, apellidos, documento, telefono, correo, username, password, password2, estado, empresa, proceso, rol)
VALUES ('Juan', 'Pérez', 123456789, 1234567890, 'juan.perez@example.com', '${username}', '${hashedPassword}', NULL, TRUE, 1, 2, 'ninguno');