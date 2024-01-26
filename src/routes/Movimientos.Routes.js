import { getMovimiento, getMovimientos, moveItems, moveSimcards } from '../controllers/Movimientos.Controllers.js'
import { setDatabaseConnection } from '../middleware/setDatabase.js'
import { Router } from 'express'

export const MovimientosMongoDB = Router()

MovimientosMongoDB.get('/getMovimientos/:company', setDatabaseConnection, getMovimientos)

MovimientosMongoDB.get('/movimiento/:company/:id', setDatabaseConnection, getMovimiento)

MovimientosMongoDB.post('/moveItem', setDatabaseConnection, moveItems)

MovimientosMongoDB.post('/moveSimcard', setDatabaseConnection, moveSimcards)
