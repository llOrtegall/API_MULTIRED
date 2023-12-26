import { Router } from 'express'
import { createItem, getItems, createBodega, addItemToBodega, findBodegaWithItems, getBodegas, createMovimiento, getMovimientos, moveItem } from '../controllers/mondoDb.controller.js'

export const mongoDB = Router()

mongoDB.post('/createItem', createItem)

mongoDB.get('/getItems', getItems)

mongoDB.post('/createBodega', createBodega)

mongoDB.post('/addItemToBodega', addItemToBodega)

mongoDB.post('/findBodegaWithItems', findBodegaWithItems)

mongoDB.get('/getBodegas', getBodegas)

mongoDB.post('/createMovimiento', createMovimiento)

mongoDB.get('/getMovimientos', getMovimientos)

mongoDB.post('/moveItem', moveItem)
