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
    const [result] = await connectMysql.query('SELECT id, nombre, apellidos, correo, username, password, proceso FROM login_chat_v1 WHERE username = ?', [user])
    if (result.length === 0) {
      throw new Error(`El usuario: ${user}, No existe en el sistema.`)
    }
    const userData = result[0]
    const { id, nombre, apellidos, correo, username, password: hashedPassword, proceso } = userData
    const passwordMatches = await bcrypt.compare(password, hashedPassword)
    if (!passwordMatches) {
      throw new Error('Contraseña Incorrecta')
    }
    const token = jwt.sign({ id, username, nombre, apellidos, correo, proceso }, JWT_SECRET)
    res.cookie('token', token, { sameSite: 'none', secure: 'true' }).status(200).json({ id, username, nombre, apellidos, correo, proceso, token })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const { nombre, apellidos, documento, telefono, correo } = req.body
    const [result] = await connectMysql.query('SELECT * FROM login_chat_v1 WHERE documento = ?', [documento])
    if (result.length > 0) {
      res.status(200).json({ message: 'Usuario Ya Se Encuentra Registrado' })
      return
    }
    const username = `CP${documento}`
    const password = `CP${documento.slice(-3)}`
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const proceso = 0
    const [UserCreado] = await connectMysql.query(
      'INSERT INTO login_chat_v1 (id, nombre, apellidos, documento, telefono, correo, username, password, estado, proceso) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?, 1, ?)',
      [nombre, apellidos, documento, telefono, correo, username, hashedPassword, proceso]
    )
    if (UserCreado.affectedRows === 1) {
      res.status(201).json({ message: 'Usuario Registrado Correctamente' })
    } else {
      throw new Error('Usuario No Creado')
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}
