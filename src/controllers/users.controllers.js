import { connectMysql } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const BCRYPT_SALT_ROUNDS = 10

export const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new Error('No Token')
    }
    const userData = jwt.verify(token, JWT_SECRET, { sameSite: 'none', secure: 'true' })
    res.json(userData)
  } catch (error) {
    res.status(401).json(error.message)
  }
}

export const getLogin = async (req, res) => {
  try {
    const { user, password } = req.body
    const [result] = await connectMysql.query('SELECT id, nombres, apellidos, correo, username, password, proceso FROM login_chat WHERE username = ?', [user])
    if (result.length === 0) {
      throw new Error('Credenciales inválidas')
    }
    const userData = result[0]
    const { id, nombres, apellidos, correo, username, password: hashedPassword, proceso } = userData
    const passwordMatches = await bcrypt.compare(password, hashedPassword)
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas')
    }
    const token = jwt.sign({ id, username, nombres, apellidos, correo, proceso }, JWT_SECRET)
    res.cookie('token', token, { sameSite: 'none', secure: 'true' }).status(200).json({ id, username, nombres, apellidos, correo, proceso, token })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const { nombres, apellidos, documento, telefono, correo, proceso } = req.body
    const [result] = await connectMysql.query('SELECT * FROM login_chat WHERE documento = ?', [documento])
    if (result.length > 0) {
      res.status(200).json({ message: 'Usuario Ya Se Encuentra Registrado' })
      return
    }
    const username = `CP${documento}`
    const password = `CP${documento.slice(-3)}`
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const [UserCreado] = await connectMysql.query(
      `INSERT INTO login_chat (nombres, apellidos, documento, telefono, correo, username, password, estado, empresa, proceso, rol) 
        VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, 1, ?, 'ninguno');`,
      [nombres, apellidos, documento, telefono, correo, username, hashedPassword, proceso]
    )
    if (UserCreado.affectedRows === 1) {
      res.status(201).json({ message: 'Usuario Registrado Correctamente' })
    } else {
      throw new Error('Usuario No Creado')
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
    console.log(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body

    // Fetch the user
    const [users] = await connectMysql.query('SELECT * FROM login_chat WHERE username = ?', [username])
    if (users.length === 0) {
      throw new Error('Credenciales inválidas')
    }

    const user = users[0]

    // Check the old password
    const passwordMatches = await bcrypt.compare(oldPassword, user.password)
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas')
    }

    // Validate the new password
    if (newPassword !== confirmPassword) {
      throw new Error('Las nuevas contraseñas no coinciden')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)

    // Update the password in the database
    await connectMysql.query('UPDATE login_chat_v1 SET password = ? WHERE username = ?', [hashedPassword, username])

    res.status(200).json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
