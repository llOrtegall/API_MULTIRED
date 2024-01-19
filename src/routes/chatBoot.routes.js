import { Router } from 'express'
import { getClientes, updateCliente, reportCliente } from '../Controllers/ChatBoot.Controllers.js'

export const ChatBoot = Router()

ChatBoot.get('/clientes', getClientes)

ChatBoot.post('/reportClient', reportCliente)

ChatBoot.put('/cliente', updateCliente)
