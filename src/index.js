import express from 'express'
import { routerUser } from './routes/users.routes.js'
import { chatBootClient } from './routes/chatBoot.routes.js'
import { routerCF } from './routes/clienteFiel.routes.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
const PORT = process.env.PUERTO_API || 4000

app.disable('x-powered-by')

dotenv.config()
app.use(cors(
  {
    origin: [// Agrega más URLs según sea necesario
      'http://localhost',
      'http://172.20.1.160',
      'http://localhost:5173'
    ],
    credentials: true
  }
))

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
