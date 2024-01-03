import { Router } from 'express'
import { createItem, getItems, createBodega, addItemToBodega, findBodegaWithItems, getBodegas, getMovimientos, moveItems, getBodegaSucursal, getMovimiento, createSimcard } from '../controllers/mongoDb.controller.js'

export const mongoDB = Router()

mongoDB.post('/createItem', createItem)

mongoDB.get('/getItems', getItems)

mongoDB.post('/createBodega', createBodega)

mongoDB.post('/addItemsToBodega', addItemToBodega)

mongoDB.get('/findBodegaWithItems', findBodegaWithItems)

mongoDB.get('/getBodegas', getBodegas)

mongoDB.get('/getBodega/:sucursal', getBodegaSucursal)

mongoDB.get('/getMovimientos', getMovimientos)

mongoDB.get('/movimiento/:id', getMovimiento)

mongoDB.post('/moveItem', moveItems)

mongoDB.post('/createSimcard', createSimcard)
