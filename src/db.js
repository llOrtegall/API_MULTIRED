import { createPool } from 'mysql2/promise'
import { logger } from './services/logsApp.js'
import oracledb from 'oracledb'
import env from 'dotenv'

env.config()

oracledb.initOracleClient({ libDir: process.env.ORACLE_ROUTE })

const requiredEnvVars = ['HOSTMYSQL', 'USUARIO', 'PASSWORD', 'PUERTO', 'NAME_DATABASE', 'USER_NAME', 'PASS_WORD', 'CONECT_STRING']
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    logger.error(`La variable de entorno ${varName} no está definida`)
    process.exit(1)
  }
}

// Creando la conexión Mysql
export const conecToMysqlChatBot = async () => {
  try {
    const pool = createPool({
      host: process.env.HOSTMYSQL,
      user: process.env.USUARIO,
      password: process.env.PASSWORD,
      port: process.env.PUERTO,
      database: process.env.NAME_DATABASE
    })
    return pool
  } catch (error) {
    logger.error('Error al establecer la conexión con MySQL', error)
    return null
  }
}

// Creando el pool de conexiones a bd Clientes
export const createPool2 = async () => {
  try {
    const pool = await oracledb.createPool({
      user: process.env.USER_NAME,
      password: process.env.PASS_WORD,
      connectString: process.env.CONECT_STRING
    })
    return pool
  } catch (error) {
    logger.error('Error al establecer la conexión con OracleDb', error)
    return null
  }
}

export const conecToLoginMysql = createPool({
  host: process.env.MYSQLLOGIN,
  user: process.env.USR,
  password: process.env.PASS,
  port: process.env.PORT,
  database: process.env.DATABASE
})
