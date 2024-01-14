import { createPool } from 'mysql2/promise'

export const getPoolChatBot = async () => {
  let pool
  try {
    pool = createPool({
      host: process.env.HOSTMYSQL,
      user: process.env.USUARIO,
      password: process.env.PASSWORD,
      port: process.env.PUERTO,
      database: process.env.NAME_DATABASE,
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
