import { ValidarUsuario } from '../schemas/userSchema.js'

import { getUsersService, getLoginService, registerUserService, changePasswordService, forgotPasswordService, ResetPasswordService } from '../services/user.services.js'

import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getUserByToken = async (req, res) => {
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
  try {
    const result = await getLoginService(req.body)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const createUser = async (req, res) => {
  // TODO: Validar que lleguen los datos requeridos y de forma correcta
  const result = await ValidarUsuario(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error })
  }

  try {
    const response = await registerUserService({ data: result })
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const response = await changePasswordService(req.body)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const response = await forgotPasswordService(req.body)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const ResetPassword = async (req, res) => {
  try {
    const response = await ResetPasswordService(req.body)
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json(error)
  }
}
