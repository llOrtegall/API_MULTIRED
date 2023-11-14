import { validateUser } from '../../schemas/userSchema.js'
import { connectMysql } from '../db.js'

// TODO: trae los clientes registrados en x chatBoot
export const getClientes = async (req, res) => {
  const [result] = await connectMysql.query('SELECT * FROM personayumbo')
  res.status(202).json(result)
}

// TODO: trae 1 cliente registrado en chatBoot con la cedula
export const getClient = async (req, res) => {
  const { cc } = req.body
  try {
    const [result] = await connectMysql.query('SELECT * FROM personayumbo WHERE cedula = ?', [cc])
    if (result.length > 0) {
      res.status(200).json(result[0])
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

// TODO: Función que actualiza el cliente en Chat Boot
export const updateCliente = async (req, res) => {
  const { updateUser } = req.body
  const result = validateUser(updateUser)

  if (!result.success) {
    return res.status(400).json({ error: result.error.message })
  }

  const { nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula } = result.data
  const nombre = `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim().toUpperCase()

  try {
    const [result] = await connectMysql.execute('SELECT * FROM personayumbo WHERE cedula = ? ', [cedula])
    if (result.length > 0) {
      const query = 'UPDATE personayumbo SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?'
      const [result2] = await connectMysql.execute(query, [nombre, telefono, correo, cedula])
      res.status(200).json({ message: 'Cliente Actualizado', detalle: result2 })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar el cliente' })
  }
}

// TODO: Función que elimina el cliente en Chat Boot
export const deleteCliente = async (req, res) => {
  const { cedula } = req.body
  try {
    const [result] = await connectMysql.query('SELECT * FROM personayumbo WHERE cedula = ?', [cedula])
    if (result.length > 0) {
      const query = 'DELETE FROM personayumbo WHERE cedula = ?'
      const [result2] = await connectMysql.execute(query, [cedula])
      res.status(200).json({ message: 'Cliente Eliminado', detalle: result2 })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar el cliente' })
  }
}
