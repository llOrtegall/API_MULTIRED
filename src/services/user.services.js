import { generatePassword, generateUsername, forgotPasswordSend } from '../Utils/funtionsReutilizables.js'
import { Company, Proceso, State } from '../Utils/Definiciones.js'
import { getPoolLogin } from '../Connections/MysqlLoginDB.js'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET
const BCRYPT_SALT_ROUNDS = 10

export const getUsersService = async () => {
  const pool = await getPoolLogin()
  const [response] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat')
  response.forEach((element) => {
    element.estado = State({ estado: element.estado })
    element.empresa = Company({ empresa: element.empresa })
    element.proceso = Proceso({ proceso: element.proceso })
    delete element.id
  })
  return response
}

export const LoginService = async (data) => {
  const { user, password } = data

  if (!user || !password) {
    throw new Error('El Usuario / Contraseña Son Requeridos')
  }
  const pool = await getPoolLogin()
  const [result] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat WHERE username = ?', [user])
  if (result.length === 0) {
    throw new Error(`El Usuario ${user} No Se Encuentra Registrado`)
  }
  const passwordMatches = await bcrypt.compare(password, result[0].password)
  if (!passwordMatches) {
    throw new Error('Contraseña Incorrecta !!!')
  }
  if (result[0].estado === 0) {
    throw new Error('Usuario Se Ecuentra Inactivo')
  }
  delete result[0].id; delete result[0].password; delete result[0].password2; delete result[0].estado
  const { 'BIN_TO_UUID(id)': id, ...rest } = result[0]
  result[0] = { id, ...rest }

  result.forEach((element) => {
    element.empresa = Company({ empresa: element.empresa })
    element.proceso = Proceso({ proceso: element.proceso })
  })
  const token = jwt.sign(result[0], JWT_SECRET, { expiresIn: '1h' })
  return { auth: true, token }
}

export const registerUserService = async ({ data }) => {
  const pool = await getPoolLogin()
  const { nombres, apellidos, documento, telefono, correo, empresa, proceso, rol } = data.data
  const [existingUser] = await pool.query('SELECT documento FROM login_chat WHERE documento = ?', [documento])
  if (existingUser.length > 0) {
    throw new Error(`El usuario con el documento N° ${documento} ya existe.`)
  }
  const password = generatePassword(documento)
  const username = generateUsername(documento)
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  const [createdUser] = await pool.query(
    `INSERT INTO login_chat (nombres, apellidos, documento, telefono, correo, username, password, estado, empresa, proceso, rol) 
     VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?);`,
    [nombres, apellidos, documento, telefono, correo, username, passwordHash, empresa, proceso, rol]
  )
  if (createdUser.affectedRows === 0) {
    throw new Error('Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.')
  }
  return { message: 'Usuario creado correctamente.' }
}

export const changePasswordService = async (data) => {
  const { username, oldPassword, newPassword, confirmPassword } = data
  if (!username || !oldPassword || !newPassword || !confirmPassword) {
    throw new Error('Todos los campos son obligatorios')
  }
  const pool = await getPoolLogin()
  const [users] = await pool.query('SELECT * FROM login_chat WHERE username = ?', [username])
  if (users.length === 0) {
    throw new Error('Credenciales inválidas')
  }
  const user = users[0]
  const passwordMatches = await bcrypt.compare(oldPassword, user.password)
  if (!passwordMatches) {
    throw new Error('Contraseña Actual No Coincide')
  }
  if (newPassword !== confirmPassword) {
    throw new Error('La nueva contraseña no coinciden')
  }
  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
  const [updateResult] = await pool.query('UPDATE login_chat SET password = ? WHERE username = ?', [hashedPassword, username])
  if (updateResult.affectedRows === 0) {
    throw new Error('No se pudo actualizar la contraseña')
  }
  return { message: 'Contraseña Actualizada Correctamente' }
}

export const forgotPasswordService = async (data) => {
  const { username, correo } = data
  const pool = await getPoolLogin()
  const [result] = await pool.query('SELECT * FROM login_chat WHERE username = ? AND correo = ?', [username, correo])
  if (result.length === 0) {
    throw new Error('Usuario No Econtrado Verificar Datos')
  }
  // TODO: Generar token y fecha de expiración
  const token = crypto.randomBytes(40).toString('hex')
  const now = new Date()
  now.setMinutes(now.getMinutes() + 10)
  await pool.query('UPDATE login_chat SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE username = ? OR correo = ?', [token, now, username, correo])
  const { nombres, apellidos, documento, empresa, rol } = (result[0])
  const companyParsed = Company({ empresa })
  const user = { nombres, apellidos, documento, empresa: companyParsed, rol, correo }
  await forgotPasswordSend({ user, token })
  return { message: 'Se ha generado la solicitud para recuperar la contraseña' }
}

export const ResetPasswordService = async (data) => {
  const { token, password } = data
  const pool = await getPoolLogin()
  const [result] = await pool.query('SELECT * FROM login_chat WHERE resetPasswordToken = ?', [token])
  if (result.length === 0) {
    throw new Error('Token inválido')
  }
  const now = new Date()
  if (now > result[0].resetPasswordExpires) {
    throw new Error('Token expirado')
  }
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  const result2 = await pool.query('UPDATE login_chat SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ? WHERE resetPasswordToken = ?', [hashedPassword, '', null, token])
  if (result2.length === 0) {
    throw new Error('Error al recuperar la contraseña')
  }
  return { message: 'Contraseña restablecida con éxito.' }
}
