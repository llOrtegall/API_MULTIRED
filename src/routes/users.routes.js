import { Router } from 'express'
import { UserByToken, createUser, Login, changePassword, getUsers, forgotPassword, ResetPassword, LogOutUser } from '../controllers/users.controllers.js'

export const LoginUser = Router()

LoginUser.post('/login', Login)

LoginUser.post('/logout', LogOutUser)

LoginUser.get('/profile', UserByToken)

LoginUser.post('/register', createUser)

LoginUser.get('/users', getUsers)

LoginUser.post('/changePassword', changePassword)

LoginUser.post('/forgotPassword', forgotPassword)

LoginUser.post('/resetPassword', ResetPassword)
