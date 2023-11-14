import { Router } from 'express'
import { getClientes, getClient, updateCliente, deleteCliente } from '../controllers/chatBoot.controller.js'

export const chatBootClient = Router()

chatBootClient.get('/clientes', getClientes)

chatBootClient.post('/cliente', getClient)

chatBootClient.put('/cliente', updateCliente)

chatBootClient.post('/deleteClient', deleteCliente)
