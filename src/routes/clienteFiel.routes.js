import { Router } from 'express'
import { createdClientFiel, getClientFiel, getClientFiel2 } from '../controllers/clienteFiel.controller.js'

export const routerCF = Router()

routerCF.post('/getCF', getClientFiel)

routerCF.post('/newCF', createdClientFiel)

routerCF.post('/getCF2', getClientFiel2)
