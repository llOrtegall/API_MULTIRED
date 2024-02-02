import { ValidarUsuario } from '../schemas/userSchema.js'

import { getUsersService, getUserByToken, LoginService, registerUserService, changePasswordService, forgotPasswordService, ResetPasswordService } from '../services/user.services.js'

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const LogOutUser = async (req, res) => {
  res.cookie('token', '', { sameSite: 'none', secure: true }).status(200).json({ auth: false })
}

export const UserByToken = async (req, res) => {
  const token = req.cookies?.token
  if (token) {
    try {
      const Responde = await getUserByToken(token)
      res.status(200).json({ auth: Responde.auth, UserLogin: Responde.UserLogin.UserLogin })
    } catch (error) {
      return res.status(401).json({ message: error.message })
    }
  } else {
    return res.status(401).json({ message: 'No se encuentra el token' })
  }
}

export const Login = async (req, res) => {
  try {
    const { token, UserLogin } = await LoginService(req.body)
    return res.cookie('token', token, { sameSite: 'none', secure: true }).status(200).json({ auth: true, UserLogin })
  } catch (error) {
    console.log(error)
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
