import { Router } from 'express'
import { getUser, createUser, getLogin } from '../controllers/users.controllers.js'

export const routerUser = Router()

routerUser.post('/login', getLogin)

routerUser.get('/profile', getUser)

routerUser.post('/register', createUser)
