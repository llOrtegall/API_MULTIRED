 # // TODO: SCHEMA DE LOGIN EN BASE DE DATOS
CREATE TABLE login_chat (
    id BINARY(16) NOT NULL PRIMARY KEY DEFAULT (uuid_to_bin(uuid())),
    nombres VARCHAR(60) NOT NULL,
    apellidos VARCHAR(60) NOT NULL,
    documento BIGINT NOT NULL UNIQUE,
    telefono BIGINT NOT NULL,
    correo VARCHAR(80) NOT NULL UNIQUE,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(80) NOT NULL,
    password2 VARCHAR(80),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    empresa INT DEFAULT 0 CHECK (empresa >= 0 AND empresa <= 2),
    proceso INT DEFAULT 0 CHECK (proceso >= 0 AND proceso <= 9),
    rol VARCHAR(30),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resetPasswordToken VARCHAR(255),
    resetPasswordExpires DATETIME
);

+----------------------+--------------+------+-----+---------------------+-------------------+
| Field                | Type         | Null | Key | Default             | Extra             |
+----------------------+--------------+------+-----+---------------------+-------------------+
| id                   | binary(16)   | NO   | PRI | uuid_to_bin(uuid()) | DEFAULT_GENERATED |
| nombres              | varchar(60)  | NO   |     | NULL                |                   |
| apellidos            | varchar(60)  | NO   |     | NULL                |                   |
| documento            | bigint       | NO   | UNI | NULL                |                   |
| telefono             | bigint       | NO   |     | NULL                |                   |
| correo               | varchar(80)  | NO   | UNI | NULL                |                   |
| username             | varchar(60)  | NO   | UNI | NULL                |                   |
| password             | varchar(80)  | NO   |     | NULL                |                   |
| password2            | varchar(80)  | YES  |     | NULL                |                   |
| estado               | tinyint(1)   | NO   |     | 1                   |                   |
| empresa              | int          | YES  |     | 0                   |                   |
| proceso              | int          | YES  |     | 0                   |                   |
| rol                  | varchar(30)  | YES  |     | NULL                |                   |
| fecha_creacion       | timestamp    | YES  |     | CURRENT_TIMESTAMP   | DEFAULT_GENERATED |
| resetPasswordToken   | varchar(255) | YES  |     | NULL                |                   |
| resetPasswordExpires | datetime     | YES  |     | NULL                |                   |
+----------------------+--------------+------+-----+---------------------+-------------------+