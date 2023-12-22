import { Router } from 'express'
import { createItem } from '../controllers/mondoDb.controller.js'

export const mongoDB = Router()

mongoDB.post('/createItem', createItem)
