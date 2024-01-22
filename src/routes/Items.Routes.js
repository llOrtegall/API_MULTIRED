import { Router } from 'express'
import { createItem, getItems, deleteItem, updateItem } from '../Controllers/Items.Controllers.js'

export const ItemsMongoDB = Router()

ItemsMongoDB.post('/createItem', createItem)

ItemsMongoDB.get('/getItems', getItems)

ItemsMongoDB.patch('/updateItem', updateItem)

ItemsMongoDB.delete('/deleteItem/:id', deleteItem)
