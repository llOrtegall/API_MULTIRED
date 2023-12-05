import { createPool } from 'mysql2/promise'
import env from 'dotenv'

env.config()

// Creando la conexión ChatBot
export const conecToMysqlChatBot = async () => {
  const pool = createPool({
    host: process.env.HOSTMYSQL,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    port: process.env.PUERTO,
    database: process.env.NAME_DATABASE
  })
  return pool
}
