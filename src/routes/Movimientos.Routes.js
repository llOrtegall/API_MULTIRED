import { Router } from 'express'
import { getMovimiento, getMovimientos, moveItems, moveSimcards } from '../controllers/Movimientos.Controller.js'

export const MovimientosMongoDB = Router()

MovimientosMongoDB.get('/getMovimientos', getMovimientos)

MovimientosMongoDB.get('/movimiento/:id', getMovimiento)

MovimientosMongoDB.post('/moveItem', moveItems)

MovimientosMongoDB.post('/moveSimcard', moveSimcards)
