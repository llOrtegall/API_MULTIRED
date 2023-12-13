import { createPool } from 'mysql2/promise'

// Creando la conexión ChatBot
export const getPoolLogin = async () => {
  let pool
  try {
    pool = createPool({
      host: process.env.MYSQLLOGIN,
      user: process.env.USR,
      password: process.env.PASS,
      port: process.env.PORT,
      database: process.env.DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    })
  } catch (error) {
    console.error('Error creating MySQL pool', error)
    throw error
  }
  return pool
}
