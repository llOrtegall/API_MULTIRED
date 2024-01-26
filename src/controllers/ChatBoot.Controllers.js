import { resportEmail, consultaTable } from '../utils/funtionsReutilizables.js'
import { getPoolChatBot } from '../connections/mysqlDBChatBot.js'
import { validateUser } from '../schemas/userSchema.js'

export const getClientes = async (req, res) => {
  const company = (req.query.select)

  if (!company) {
    return res.status(400).json({ message: 'El campo table es requerido' })
  }
  try {
    const pool = await getPoolChatBot()
    if (pool === null) {
      return res.status(500).json({ message: 'Error al establecer la conexión con la base de datos' })
    }
    const [result] = await pool.query(`SELECT * FROM ${consultaTable(company)}`)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes' })
  }
}

export const updateCliente = async (req, res) => {
  const { updateUser, emp } = req.body
  const result = validateUser(updateUser)
  if (!result.success) {
    return res.status(400).json({ message: result.error.message })
  }
  const { nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula } = result.data
  const nombre = `${nombre1} ${nombre2} ${apellido1} ${apellido2}`.trim().toUpperCase()
  try {
    const pool = await getPoolChatBot()
    const [result] = await pool.execute(`SELECT * FROM ${consultaTable(emp)} WHERE cedula = ? `, [cedula])
    if (result.length > 0) {
      const query = `UPDATE ${consultaTable(emp)} SET nombre = ?, telefono = ?, correo = ? WHERE cedula = ?`
      const [result2] = await pool.execute(query, [nombre, telefono, correo, cedula])
      res.status(200).json({ message: 'Cliente Actualizado', detalle: result2 })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente' })
  }
}

export const reportCliente = async (req, res) => {
  const data = req.body
  console.log(data)
  if (!data || !data.motivo || data.motivo === '') {
    return res.status(400).json({ message: 'El motivo es obligatorio' })
  }
  try {
    await resportEmail({ data })
    res.status(200).json({ message: 'Solicitud Enviada' })
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el reporte del cliente' })
  }
}
