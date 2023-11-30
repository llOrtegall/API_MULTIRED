import { chatBootClient } from './routes/chatBoot.routes.js'
import { routerCF } from './routes/clienteFiel.routes.js'
import { routerUser } from './routes/users.routes.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const ACCEPTED_ORIGINS = [
  'http://172.20.1.160',
  'http://localhost:5173'
]

const app = express()

app.disable('x-powered-by')
const PORT = process.env.PUERTO_API || 4000

app.use(cors({
  credentials: true,
  origin: ACCEPTED_ORIGINS
}))

app.use(morgan('dev'))

app.use(cookieParser())
app.use(express.json())

// TODO: Metodos En Usuarios Login
app.use(routerUser)

// TODO: Metodos Cliente Fiel
app.use(routerCF)

// TODO: Metodos En Chat Boot DB
app.use(chatBootClient)

app.listen(PORT, () => {
  console.log(`Server Iniciado En El Puerto http://localhost:${PORT}`)
})
