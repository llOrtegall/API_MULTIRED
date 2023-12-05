import { connection } from '../databases/userConnectionMysql.js'
import { Company, Proceso, State } from '../services/Definiciones.js'
import { ValidarUsuario } from '../../schemas/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const BCRYPT_SALT_ROUNDS = 10

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida')
}

export const getUsers = async (req, res) => {
  const pool = await connection()
  try {
    const [result] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat')
    result.forEach((element) => {
      element.estado = State({ estado: element.estado })
      element.empresa = Company({ empresa: element.empresa })
      element.proceso = Proceso({ proceso: element.proceso })
      delete element.id
    })
    return res.status(200).json(result)
  } catch (error) {
    pool.end()
    return res.status(500).json({ error: 'Error al obtener los usuarios' })
  } finally {
    pool.end()
  }
}

export const getUser = async (req, res) => {
  const token = req.body.token
  if (!token) {
    return res.status(401).json({ message: 'No se ha enviado el token' })
  }
  try {
    const userData = jwt.verify(token, JWT_SECRET)
    res.status(200).json(userData)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

export const getLogin = async (req, res) => {
  const { user, password } = req.body
  // TODO: Primero valida que lleguen las credenciales
  if (!user || !password) {
    return res.status(400).json({ error: 'El usuario y la contraseña son requeridos' })
  }

  // TODO: solicita y espera la conexión a la base de datos
  const pool = await connection()

  try {
    const [result] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat WHERE username = ?', [user])

    if (result.length === 0) {
      return res.status(401).json({ error: 'El Usuario No Existe' })
    }

    // TODO: Verifica que la contraseña sea correcta
    const passwordMatches = await bcrypt.compare(password, result[0].password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Clave Invalida Retifiquela' })
    }

    if (result[0].estado === 0) {
      return res.status(401).json({ error: 'Usuario Inactivo' })
    }

    // TODO: Remueve datos sensibles del usuario
    delete result[0].id; delete result[0].password; delete result[0].password2; delete result[0].estado

    // TODO: envía los respetivas deficiniones de los campos
    result.forEach((element) => {
      element.estado = State({ estado: element.estado })
      element.empresa = Company({ empresa: element.empresa })
      element.proceso = Proceso({ proceso: element.proceso })
    })

    // TODO: Genera el token
    const token = jwt.sign({ result }, JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({ user: { ...result[0] }, token })
  } catch (error) {
    pool.end()
    return res.status(401).json({ error })
  } finally {
    pool.end()
  }
}

export const createUser = async (req, res) => {
  // TODO: Validar que lleguen los datos requeridos y de forma correcta
  const result = await ValidarUsuario(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error })
  }

  const pool = await connection()

  try {
    const { nombres, apellidos, documento, telefono, correo, empresa, proceso, rol } = result.data

    // TODO: Validar que el usuario no exista
    const [result2] = await pool.query('SELECT documento FROM login_chat WHERE documento = ?', [documento])
    console.log(result2)
    if (result2.length > 0) {
      return res.status(401).json({ error: `El usuario con N° ${documento}, Ya Existe` })
    }

    // TODO: Generar la contraseña y el username de forma automatica y por defecto
    const password = `CP${documento.toString().slice(-3)}`
    const username = `CP${documento.toString()}`
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    // TODO: Guardar el usuario en la base de datos
    const [UserCreado] = await pool.query(
      `INSERT INTO login_chat (nombres, apellidos, documento, telefono, correo, username, password, estado, empresa, proceso, rol) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?);`,
      [nombres, apellidos, documento, telefono, correo, username, passwordHash, empresa, proceso, rol]
    )

    if (UserCreado.affectedRows === 1) {
      return res.status(201).json({ message: 'Usuario Registrado Correctamente' })
    }
  } catch (error) {
    pool.end()
    console.log(error)
    return res.status(500).json({ error: 'Error al registrar el usuario' })
  } finally {
    pool.end()
  }
}

export const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body
  if (!username || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  const pool = await connection()

  try {
    const [users] = await pool.query('SELECT * FROM login_chat WHERE username = ?', [username])
    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    const user = users[0]
    const passwordMatches = await bcrypt.compare(oldPassword, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Contraseña Actual No Coincide' })
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'La nueva contraseña no coinciden' })
    }
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)
    const [updateResult] = await connection.query('UPDATE login_chat SET password = ? WHERE username = ?', [hashedPassword, username])
    if (updateResult.affectedRows === 0) {
      throw new Error('No se pudo actualizar la contraseña')
    }
    res.status(200).json({ message: 'Contraseña Actualizada Correctamente' })
  } catch (error) {
    pool.end()
    res.status(500).json({ error })
  } finally {
    pool.end()
  }
}
