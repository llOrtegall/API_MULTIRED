import { createConnection } from 'mysql2/promise'
// Creando la conexión Login
export const connection = async () => {
  try {
    const pool = await createConnection({
      host: process.env.MYSQLLOGIN,
      user: process.env.USR,
      password: process.env.PASS,
      port: process.env.PORT,
      database: process.env.DATABASE
    })
    return pool
  } catch (error) {
    console.error(`Failed to create a connection: ${error.message}`)
    throw error
  }
}
