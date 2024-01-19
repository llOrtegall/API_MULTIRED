import { createPool } from 'mysql2/promise'

export const getPoolLogin = async () => {
  let pool
  try {
    pool = createPool({
      host: process.env.MYSQLLOGIN,
      user: process.env.USR,
      port: process.env.PORT,
      password: process.env.PASS,
      database: process.env.DATABASE,
      waitForConnections: false,
      connectionLimit: 3,
      queueLimit: 5
    })
  } catch (error) {
    console.error('Error creating MySQL pool', error)
    throw new Error('Error al conectar con la base de datos')
  }
  return pool
}
