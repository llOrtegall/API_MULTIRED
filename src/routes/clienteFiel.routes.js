import { Router } from 'express'
import { createdClientFiel, getClientFiel } from '../controllers/clienteFiel.controller.js'

export const ClienteFiel = Router()

ClienteFiel.post('/getCF', getClientFiel)

ClienteFiel.post('/newCF', createdClientFiel)
