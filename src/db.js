import { createPool } from 'mysql2/promise'
import env from 'dotenv'
import oracledb from 'oracledb'

env.config()

oracledb.initOracleClient({ libDir: process.env.ORACLE_ROUTE })

// TODO: Creando la conecxión Mysql
export const connectMysql = createPool({
  host: process.env.HOSTMYSQL,
  user: process.env.USUARIO,
  password: process.env.PASSWORD,
  port: process.env.PUERTO,
  database: process.env.NAME_DATABASE
})

// TODO: Creando la conecxión a bd Clientes
export const connectOraDb = await oracledb.getConnection({
  user: process.env.USER_NAME,
  password: process.env.PASS_WORD, // contains the hr schema password
  connectString: process.env.CONECT_STRING
})

export const conecToLoginMysql = createPool({
  host: process.env.MYSQLLOGIN,
  user: process.env.USR,
  password: process.env.PASS,
  port: process.env.PORT,
  database: process.env.DATABASE
})
