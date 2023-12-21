import { Router } from 'express'
import { getUser, createUser, getLogin, changePassword, getUsers, forgotPassword, ResetPassword } from '../controllers/users.controllers.js'

export const LoginUser = Router()

LoginUser.post('/login', getLogin)

LoginUser.get('/profile', getUser)

LoginUser.post('/register', createUser)

LoginUser.get('/users', getUsers)

LoginUser.post('/changePassword', changePassword)

LoginUser.post('/forgotPassword', forgotPassword)

LoginUser.post('/resetPassword', ResetPassword)
