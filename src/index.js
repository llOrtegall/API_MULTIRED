import { chatBootClient } from './routes/chatBoot.routes.js'
import { routerCF } from './routes/clienteFiel.routes.js'
import { corsMiddleware } from '../middlewares/cors.js'
import { routerUser } from './routes/users.routes.js'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PUERTO_API || 4000

app.use(cookieParser())
app.use(express.json())

app.disable('x-powered-by')
app.use(corsMiddleware())

// TODO: Metodos En Usuarios Login
app.use(routerUser)

// TODO: Metodos Cliente Fiel
app.use(routerCF)

// TODO: Metodos En Chat Boot DB
app.use(chatBootClient)

app.listen(PORT, () => {
  console.log(`Server Iniciado En El Puerto http://localhost:${PORT}`)
})
