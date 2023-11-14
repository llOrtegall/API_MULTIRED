import { connectMysql } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const bcryptSalt = bcrypt.genSaltSync(10)

// TODO: /profile
export const getUser = async (req, res) => {
  try {
    const token1 = req.headers.authorization
    const token = token1.split(' ')[1]
    if (token) {
      jwt.verify(token, JWT_SECRET, { sameSite: 'none', secure: 'true' }, (err, userData) => {
        if (err) throw err
        res.json(userData)
      })
    }
  } catch (error) {
    res.status(401).json('No Token')
  }
}

// TODO: /login
export const getLogin = async (req, res) => {
  const { user, password } = req.body

  const [result] = await connectMysql.query(`SELECT username, password, nombres, apellidos FROM login WHERE username = '${user}'`)

  if (result.length > 0) {
    const userData = result.find((i) => i)
    const { username, password: passDb, id, nombres, apellidos } = userData
    const passOk = bcrypt.compareSync(password, passDb)

    if (passOk) {
      jwt.sign({ id, username, nombres, apellidos }, JWT_SECRET, {}, (err, token) => {
        if (err) throw err
        res.cookie('token', token, { sameSite: 'none', secure: 'true' }).status(200).json({ id, username, nombres, apellidos, token })
      })
	console.log(`Logueado: ${nombres} - User: ${username}`)
    } else {
      res.status(401).json({
        error: 'Contraseña Incorrecta',
        detalle: 'La clave del usuario no coinciden'
      })
    }
  } else {
    res.status(404).json({
      error: 'Usuario No Registrado',
      detalle: `El usuario: ${user}, No existe en el sistema.`
    })
  }
}

// TODO: /register
export const createUser = async (req, res) => {
  const { names, lastNames, document } = req.body
 
  try {
    const [result] = await connectMysql.query(`SELECT * FROM login WHERE documento = '${document}'`)

    if (!result.length > 0) {
      const username = `CP${document}`
      const pass = `CP${document.slice(-3)}`
      const hashedPassword = bcrypt.hashSync(pass, bcryptSalt)

      const [UserCreado] = await connectMysql.query(`INSERT INTO login (username, password, nombres, apellidos, documento) 
      VALUES ('${username}', '${hashedPassword}', '${names} ', '${lastNames}', '${document}')`)

      if (UserCreado.affectedRows === 1) {
        res.status(201).json({ message: 'Usuario Registrado Correctamente' })
	console.log(`Usuario Registrado: ${names} - User: ${username}`)
      } else {
        res.status(500).json({ message: 'Usuario No Creado' })
      }
    } else {
      res.status(200).json({ message: 'Usuario Ya Se Encuentra Registrado' })
    }
  } catch (error) {
    res.status(409).json({
      error
    })
  }
}
