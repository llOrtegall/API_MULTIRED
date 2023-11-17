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
    console.error('Error al crear el pool de conexiones:', error)
    throw error
  }
}

export const conecToLoginMysql = createPool({
  host: process.env.MYSQLLOGIN,
  user: process.env.USR,
  password: process.env.PASS,
  port: process.env.PORT,
  database: process.env.DATABASE
})
