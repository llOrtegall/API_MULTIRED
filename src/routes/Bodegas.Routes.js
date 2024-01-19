import { Router } from 'express'
import { createBodega, getBodegaSucursal, getBodegas, findBodegaWithItems, addItemToBodega, getBodegasSim, getBodegaSucursalItemsSimcards, getBodegaSucursalSimcards } from '../Controllers/Bodegas.Controllers.js'

export const BodegasMongoDB = Router()

BodegasMongoDB.post('/createBodega', createBodega)

BodegasMongoDB.get('/getBodegas', getBodegas)

BodegasMongoDB.get('/getBodega/:sucursal', getBodegaSucursal)

BodegasMongoDB.get('/getBodegaSimcards/:sucursal', getBodegaSucursalSimcards)

BodegasMongoDB.get('/itemsConBodegas', findBodegaWithItems)

BodegasMongoDB.post('/addItemsToBodega', addItemToBodega)

BodegasMongoDB.get('/getBodegasSim', getBodegasSim)

BodegasMongoDB.get('/getBodegasItemsSims/:id', getBodegaSucursalItemsSimcards)
