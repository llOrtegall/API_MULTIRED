import { Router } from 'express'
import { createItem, getItems, createBodega, addItemToBodega, findBodegaWithItems, getBodegas, getMovimientos, moveItems, getBodegaSucursal } from '../controllers/mongoDb.controller.js'

export const mongoDB = Router()

mongoDB.post('/createItem', createItem)

mongoDB.get('/getItems', getItems)

mongoDB.post('/createBodega', createBodega)

mongoDB.post('/addItemToBodega', addItemToBodega)

mongoDB.post('/findBodegaWithItems', findBodegaWithItems)

mongoDB.get('/getBodegas', getBodegas)

mongoDB.get('/getBodega/:sucursal', getBodegaSucursal)

mongoDB.get('/getMovimientos', getMovimientos)

mongoDB.post('/moveItem', moveItems)
