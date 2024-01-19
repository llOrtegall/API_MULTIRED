import { Router } from 'express'
import { UserByToken, createUser, Login, changePassword, getUsers, forgotPassword, ResetPassword } from '../Controllers/Users.Controllers.js'

export const LoginUser = Router()

LoginUser.post('/login', Login)

LoginUser.get('/profile', UserByToken)

LoginUser.post('/register', createUser)

LoginUser.get('/users', getUsers)

LoginUser.post('/changePassword', changePassword)

LoginUser.post('/forgotPassword', forgotPassword)

LoginUser.post('/resetPassword', ResetPassword)
