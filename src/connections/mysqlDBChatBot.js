import { createPool } from 'mysql2/promise'

// Creando la conexión ChatBot
export const getPoolChatBot = async () => {
  let pool
  try {
    pool = createPool({
      host: process.env.HOSTMYSQL,
      user: process.env.USUARIO,
      password: process.env.PASSWORD,
      port: process.env.PUERTO,
      database: process.env.NAME_DATABASE
    })
  } catch (error) {
    console.error('Error creating MySQL pool', error)
    throw error
  }
  return pool
}
