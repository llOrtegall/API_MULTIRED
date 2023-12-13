import { validateUser } from '../../schemas/userSchema.js'
import { resportEmail } from '../services/funtionsReutilizables.js'
import { getPoolChatBot } from '../connections/mysqlDBChatBot.js'
import { logger } from '../services/logsApp.js'

// TODO: trae los clientes registrados en x chatBoot

export const getClientes = async (req, res) => {
  try {
    const pool = await getPoolChatBot()
    if (pool === null) {
      return res.status(500).json({ message: 'Error al establecer la conexión con la base de datos' })
    }
    const [result] = await pool.query('SELECT * FROM personayumbo')
    res.status(200).json(result)
  } catch (error) {
    logger.error('Error al obtener los clientes', error)
    res.status(500).json({ message: 'Error al obtener los clientes' })
  }
}

export const getClientesServired = async (req, res) => {
  try {
    const pool = await getPoolChatBot()
    if (pool === null) {
      return res.status(500).json({ message: 'Error al establecer la conexión con la base de datos' })
    }
    const [result] = await pool.query('SELECT * FROM personajamundi')
    res.status(200).json(result)
  } catch (error) {
    logger.error('Error al obtener los clientes', error)
    res.status(500).json({ message: 'Error al obtener los clientes' })
  }
}

// TODO: trae 1 cliente registrado en chatBoot con la cedula
export const getClient = async (req, res) => {
  const { cc } = req.body
  if (!cc) {
    return res.status(400).json({ message: 'El campo cc es requerido' })
  }

  try {
    const pool = await getPoolChatBot()
    const [result] = await pool.query('SELECT * FROM personayumbo WHERE cedula = ?', [cc])
    if (result.length > 0) {
      res.status(200).json(result[0])
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    logger.error('Error al obtener el cliente', error)
    res.status(500).json({ message: 'Error al obtener el cliente' })
  }
}

// TODO: Función que actualiza el cliente en Chat Boot
export const updateCliente = async (req, res) => {
  const { updateUser } = req.body
  const result = validateUser(updateUser)

  if (!result.success) {
    return res.status(400).json({ message: result.error.message })
  }

  const { nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula } = result.data
  const nombre = `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim().toUpperCase()

  try {
    const pool = await getPoolChatBot()
    const [result] = await pool.execute('SELECT * FROM personayumbo WHERE cedula = ? ', [cedula])
    if (result.length > 0) {
      const query = 'UPDATE personayumbo SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?'
      const [result2] = await pool.execute(query, [nombre, telefono, correo, cedula])
      res.status(200).json({ message: 'Cliente Actualizado', detalle: result2 })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    logger.error('Error al actualizar el cliente', error)
    res.status(500).json({ message: 'Error al actualizar el cliente' })
  }
}

export const updateClienteServired = async (req, res) => {
  const { updateUser } = req.body
  const result = validateUser(updateUser)

  if (!result.success) {
    return res.status(400).json({ message: result.error.message })
  }

  const { nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula } = result.data
  const nombre = `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim().toUpperCase()

  try {
    const pool = await getPoolChatBot()
    const [result] = await pool.execute('SELECT * FROM personajamundi WHERE cedula = ? ', [cedula])
    if (result.length > 0) {
      const query = 'UPDATE personajamundi SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?'
      const [result2] = await pool.execute(query, [nombre, telefono, correo, cedula])
      res.status(200).json({ message: 'Cliente Actualizado', detalle: result2 })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    logger.error('Error al actualizar el cliente', error)
    res.status(500).json({ message: 'Error al actualizar el cliente' })
  }
}

// TODO: Función que reporta a un correo para eliminar Registro
export const reportCliente = async (req, res) => {
  const data = req.body
  if (!data || !data.motivo || data.motivo === '') {
    return res.status(400).json({ message: 'El motivo es obligatorio' })
  }
  try {
    await resportEmail({ data })
    res.status(200).json({ message: 'Solicitud Enviada' })
  } catch (error) {
    logger.error('Error al enviar el reporte del cliente', error)
    res.status(500).json({ message: 'Error al enviar el reporte del cliente' })
  }
}
