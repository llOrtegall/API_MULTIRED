import { Router } from 'express'
import { createdClientFiel, getClientFiel } from '../controllers/clienteFiel.controller.js'

export const routerCF = Router()

routerCF.post('/getCF', getClientFiel)

routerCF.post('/newCF', createdClientFiel)
