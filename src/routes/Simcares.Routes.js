import { Router } from 'express'
import { createSimcard, getSimcard, getSimcardWhitBodega, addSimcardToBodega } from '../Controllers/Simcard.Controllers.js'

export const SimcardsMongoDB = Router()

SimcardsMongoDB.get('/simcard/:id', getSimcard)

SimcardsMongoDB.post('/createSimcard', createSimcard)

SimcardsMongoDB.get('/simcardWhitBodega', getSimcardWhitBodega)

SimcardsMongoDB.post('/addSimcardToBodega', addSimcardToBodega)
