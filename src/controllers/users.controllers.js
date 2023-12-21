import { Company, Proceso, State } from '../services/Definiciones.js'
import { getPoolLogin } from '../connections/mysqlLoginDB.js'
import { ValidarUsuario } from '../../schemas/userSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const BCRYPT_SALT_ROUNDS = 10

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida')
}

export const getUsers = async (req, res) => {
  try {
    const pool = await getPoolLogin()
    const [result] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat')
    result.forEach((element) => {
      element.estado = State({ estado: element.estado })
      element.empresa = Company({ empresa: element.empresa })
      element.proceso = Proceso({ proceso: element.proceso })
      delete element.id
    })
    return res.status(200).json(result)
  } catch (error) {
    console.error(error) // Cambiado a console.error para resaltar errores
    return res.status(500).json({ error: error.message }) // Incluye el mensaje de error en la respuesta
  } finally {
    console.log('Finaliza la conexion')
    // No cerramos la conexión aquí porque queremos reutilizarla
  }
}

export const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (token !== 'null' && token !== undefined) {
    try {
      const user = jwt.verify(token, JWT_SECRET)
      return res.status(200).json({ auth: true, user })
    } catch (error) {
      return res.status(401).json({ error: 'Token Invalido' })
    }
  } else {
    return res.status(401).json({ error: 'No se ha enviado el token' })
  }
}

export const getLogin = async (req, res) => {
  const { user, password } = req.body
  // TODO: Primero valida que lleguen las credenciales
  if (!user || !password) {
    return res.status(400).json({ error: 'El Usuario / Contraseña Son Requeridos' })
  }
  // TODO: solicita y espera la conexión a la base de datos
  try {
    const pool = await getPoolLogin()
    const [result] = await pool.query('SELECT *, BIN_TO_UUID(id) FROM login_chat WHERE username = ?', [user])

    if (result.length === 0) {
      return res.status(401).json({ error: `El Usuario ${user} No Se Encuentra Registrado` })
    }
    // TODO: Verifica que la contraseña sea correcta
    const passwordMatches = await bcrypt.compare(password, result[0].password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Contraseña Incorrecta !!!' })
    }
    if (result[0].estado === 0) {
      return res.status(401).json({ error: 'Usuario Se Ecuentra Inactivo' })
    }
    // TODO: Remueve datos sensibles del usuario
    delete result[0].id; delete result[0].password; delete result[0].password2; delete result[0].estado
    // TODO: Parsea el id
    const { 'BIN_TO_UUID(id)': id, ...rest } = result[0]
    result[0] = { id, ...rest }
    // TODO: envía los respetivas deficiniones de los campos
    result.forEach((element) => {
      element.empresa = Company({ empresa: element.empresa })
      element.proceso = Proceso({ proceso: element.proceso })
    })

    // TODO: Genera el token
    const token = jwt.sign(result[0], JWT_SECRET, { expiresIn: '1h' })

    console.log(result[0], 'Se ha logueado')

    return res.status(200).json({ auth: true, token })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const createUser = async (req, res) => {
  // TODO: Validar que lleguen los datos requeridos y de forma correcta
  const result = await ValidarUsuario(req.body)
  if (result.error) {
    return res.status(400).json({ error: result.error })
  }
  try {
    const pool = await getPoolLogin()
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
    console.log(error)
    return res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

export const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword, confirmPassword } = req.body
  if (!username || !oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  try {
    const pool = await getPoolLogin()
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
    const [updateResult] = await pool.query('UPDATE login_chat SET password = ? WHERE username = ?', [hashedPassword, username])
    if (updateResult.affectedRows === 0) {
      throw new Error('No se pudo actualizar la contraseña')
    }
    return res.status(200).json({ message: 'Contraseña Actualizada Correctamente' })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const forgotPassword = async (req, res) => {
  const { username } = req.body

  const pool = await getPoolLogin()
  try {
    const [result] = await pool.query('SELECT username FROM login_chat where username = ?', [username])

    if (result.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 1) // token expira en 1 hora

    await pool.query('UPDATE login_chat SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE username = ?', [token, now, username])

    pool.end()
    res.status(200).json({ token, username })
  } catch (error) {
    pool.end()
  }
}

export const ResetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  console.log(token, newPassword)

  const pool = await getPoolLogin()

  try {
    const [result] = await pool.query('SELECT * FROM login_chat WHERE resetPasswordToken = ?', [token])

    console.log(result)

    if (result < 0) {
      return res.status(400).send({ error: 'Token inválido o expirado' })
    }

    const now = new Date()

    console.log(result.passwordResetExpires)

    if (now > result.passwordResetExpires) {
      return res.status(400).send({ error: 'Token inválido o expirado' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS) // Encripta la nueva contraseña

    const result2 = await pool.query('UPDATE login_chat SET password = ?, resetPasswordToken = ?, resetPasswordExpires = ?', [hashedPassword, '', null])

    console.log(result2)

    res.status(200).json({ message: 'Contraseña restablecida con éxito.' })
  } catch (error) {
    console.log(error)
    pool.end()
  }
}
