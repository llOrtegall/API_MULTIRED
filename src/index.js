import { ChatBoot } from './routes/chatBoot.routes.js'
import { ClienteFiel } from './routes/clienteFiel.routes.js'
import { LoginUser } from './routes/users.routes.js'
import cookieParser from 'cookie-parser'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'

dotenv.config()

const ACCEPTED_ORIGINS = [
  'http://172.20.1.160',
  'http://localhost:5173',
  'http://172.20.1.110:5173'
]

const app = express()

app.disable('x-powered-by')
const PORT = process.env.PUERTO_API || 4000

app.use(cors({
  origin: ACCEPTED_ORIGINS
}))

app.use(morgan('dev'))

app.use(cookieParser())
app.use(express.json())

// TODO: Metodos En Usuarios Login
app.use(LoginUser)

// TODO: Metodos Cliente Fiel
app.use(ClienteFiel)

// TODO: Metodos En Chat Boot DB
app.use(ChatBoot)

app.listen(PORT, () => {
  console.log(`Server Iniciado En El Puerto http://localhost:${PORT}`)
})
