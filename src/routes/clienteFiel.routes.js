import { Router } from 'express'
import { createdClientFiel, getClientFiel } from '../Controllers/ClienteFiel.Controllers.js'

export const ClienteFiel = Router()

ClienteFiel.post('/getCF', getClientFiel)

ClienteFiel.post('/newCF', createdClientFiel)
