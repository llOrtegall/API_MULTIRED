import { Router } from 'express'
import { getUserByToken, createUser, getLogin, changePassword, getUsers, forgotPassword, ResetPassword } from '../controllers/users.controllers.js'

export const LoginUser = Router()

LoginUser.post('/login', getLogin)

LoginUser.get('/profile', getUserByToken)

LoginUser.post('/register', createUser)

LoginUser.get('/users', getUsers)

LoginUser.post('/changePassword', changePassword)

LoginUser.post('/forgotPassword', forgotPassword)

LoginUser.post('/resetPassword', ResetPassword)
