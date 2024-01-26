import { Router } from 'express'
import { createBodega, getBodegaSucursal, getBodegas, findBodegaWithItems, addItemToBodega, getBodegasSim, getBodegaSucursalItemsSimcards, getBodegaSucursalSimcards } from '../controllers/Bodegas.Controllers.js'
import { setDatabaseConnection } from '../middleware/setDatabase.js'

export const BodegasMongoDB = Router()

BodegasMongoDB.post('/createBodega', setDatabaseConnection, createBodega)

BodegasMongoDB.get('/getBodegas/:company', setDatabaseConnection, getBodegas)

BodegasMongoDB.get('/getBodega/:company/:sucursal', setDatabaseConnection, getBodegaSucursal)

BodegasMongoDB.get('/getBodegaSimcards/:company/:sucursal', setDatabaseConnection, getBodegaSucursalSimcards)

BodegasMongoDB.get('/itemsConBodegas/:company', setDatabaseConnection, findBodegaWithItems)

BodegasMongoDB.post('/addItemsToBodega', setDatabaseConnection, addItemToBodega)

BodegasMongoDB.get('/getBodegasSim/:company', setDatabaseConnection, getBodegasSim)

BodegasMongoDB.get('/getBodegasItemsSims/:company/:id', setDatabaseConnection, getBodegaSucursalItemsSimcards)
