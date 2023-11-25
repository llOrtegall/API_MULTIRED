import { conecToLoginMysql } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const BCRYPT_SALT_ROUNDS = 10

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definida')
}

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      throw new Error('No se proporcionó un token')
    }
    const userData = jwt.verify(token, JWT_SECRET, { sameSite: 'none', secure: 'true' })
    res.json(userData)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

export const getLogin = async (req, res) => {
  try {
    const { user, password } = req.body
    if (!user || !password) {
      return res.status(400).json({ error: 'El usuario y la contraseña son requeridos' })
    }
    const [result] = await conecToLoginMysql.query('SELECT id, nombres, apellidos, correo, username, password, proceso FROM login_chat WHERE username = ?', [user])
    if (result.length === 0) {
      throw new Error('El Usuario No Existe ¡')
    }
    const userData = result[0]
    const { id, nombres, apellidos, correo, username, password: hashedPassword, proceso } = userData
    const passwordMatches = await bcrypt.compare(password, hashedPassword)
    if (!passwordMatches) {
      throw new Error('Clave Inválida Verifiquela ¡')
    }

    const token = jwt.sign({ id, username, nombres, apellidos, correo, proceso }, JWT_SECRET, { expiresIn: '1h' })
    res.cookie('token', token, { sameSite: 'none', secure: 'true' }).status(200).json({ id, username, nombres, apellidos, correo, proceso })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const { nombres, apellidos, documento, telefono, correo, proceso } = req.body

    if (!nombres || !apellidos || !documento || !telefono || !correo || !proceso) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    const [result] = await conecToLoginMysql.query('SELECT * FROM login_chat WHERE documento = ?', [documento])
    if (result.length > 0) {
      return res.status(409).json({ message: 'Usuario Ya Se Encuentra Registrado' })
    }
    const username = `CP${documento}`
    const password = `CP${documento.slice(-3)}`
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const [UserCreado] = await conecToLoginMysql.query(
      `INSERT INTO login_chat (nombres, apellidos, documento, telefono, correo, username, password, estado, empresa, proceso, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, 1, ?, 'ninguno');`,
      [nombres, apellidos, documento, telefono, correo, username, hashedPassword, proceso]
    )
    if (UserCreado.affectedRows === 1) {
      res.status(201).json({ message: 'Usuario Registrado Correctamente' })
    } else {
      throw new Error('Error al crear el usuario')
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body
    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    const [users] = await conecToLoginMysql.query('SELECT * FROM login_chat WHERE username = ?', [username])
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
    const [updateResult] = await conecToLoginMysql.query('UPDATE login_chat SET password = ? WHERE username = ?', [hashedPassword, username])
    if (updateResult.affectedRows === 0) {
      throw new Error('No se pudo actualizar la contraseña')
    }
    res.status(200).json({ message: 'Contraseña Actualizada Correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
