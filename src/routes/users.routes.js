import { Router } from 'express'
import { getUser, createUser, getLogin, changePassword } from '../controllers/users.controllers.js'

export const LoginUser = Router()

LoginUser.post('/login', getLogin)

LoginUser.post('/profile', getUser)

LoginUser.post('/register', createUser)

LoginUser.post('/changePassword', changePassword)
