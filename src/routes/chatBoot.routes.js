import { Router } from 'express'
import { getClientes, getClient, updateCliente, reportCliente } from '../controllers/chatBoot.controller.js'

export const ChatBoot = Router()

ChatBoot.get('/clientes', getClientes)

ChatBoot.post('/cliente', getClient)

ChatBoot.put('/cliente', updateCliente)

ChatBoot.post('/reportClient', reportCliente)
