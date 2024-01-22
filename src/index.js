import 'dotenv/config.js'

import { validateEnvVariables } from './Utils/Validacion.js'

import { MovimientosMongoDB } from './Routes/Movimientos.Routes.js'
import { SimcardsMongoDB } from './Routes/Simcares.Routes.js'
import { BodegasMongoDB } from './Routes/Bodegas.Routes.js'
import { ItemsMongoDB } from './Routes/Items.Routes.js'

import { ClienteFiel } from './Routes/ClienteFiel.Routes.js'
import { ChatBoot } from './Routes/ChatBoot.Routes.js'
import { LoginUser } from './Routes/Users.Routes.js'

import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://172.20.1.160',
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

// TODO: Métodos Bodega MongoDB
app.use(ItemsMongoDB)
app.use(BodegasMongoDB)
app.use(MovimientosMongoDB)
app.use(SimcardsMongoDB)

validateEnvVariables()

app.listen(PORT, () => {
  console.log(`Server Iniciado En El Puerto http://localhost:${PORT}`)
})
