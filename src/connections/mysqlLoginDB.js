import { createPool } from 'mysql2/promise'

export const getPoolLogin = async () => {
  let pool
  try {
    // Intenta crear un pool de conexiones a la base de datos
    pool = createPool({
      host: process.env.MYSQLLOGIN, // Dirección del servidor de la base de datos
      user: process.env.USR, // Nombre de usuario para la base de datos
      password: process.env.PASS, // Contraseña para la base de datos
      port: process.env.PORT, // Puerto para la base de datos
      database: process.env.DATABASE, // Nombre de la base de datos
      waitForConnections: false, // Si es true, el pool esperará a que haya una conexión disponible antes de lanzar un error
      connectionLimit: 3, // Número máximo de conexiones que el pool mantendrá a la vez
      queueLimit: 5 // Número máximo de solicitudes de conexión que se encolarán antes de lanzar un error. Si es 0, no hay límite
    })
  } catch (error) {
    // Si hay un error al crear el pool, lo registra en la consola
    console.error('Error creating MySQL pool', error)
    // Lanza un error con un mensaje personalizado
    throw new Error('Error al conectar con la base de datos')
  }
  // Devuelve el pool de conexiones
  return pool
}
