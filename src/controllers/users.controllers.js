import { getUsersService, LoginService, registerUserService, changePasswordService, forgotPasswordService, ResetPasswordService } from '../services/user.services.js'
import { ValidarUsuario } from '../schemas/userSchema.js'
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

export const UserByToken = async (req, res) => {
  const bearerHeader = req.headers.authorization

  if (!bearerHeader) {
    return res.status(401).json({ message: 'No Token Provided' })
  }

  const bearer = bearerHeader.split(' ')
  const token = bearer[1]

  try {
    const result = jwt.verify(token, JWT_SECRET)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(401).json({ message: error.message })
  }
}

export const Login = async (req, res) => {
  try {
    const result = await LoginService(req.body)
    const token = jwt.sign(result, JWT_SECRET, { expiresIn: '30min' })
    return res.status(200).json({ auth: true, token })
  } catch (error) {
    return res.status(400).json({ message: error.message })
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
