import 'dotenv/config.js'

import { validateEnvVariables } from './utils/Validacion.js'

import { MovimientosMongoDB } from './routes/Movimientos.Routes.js'
import { SimcardsMongoDB } from './routes/Simcares.Routes.js'
import { ClienteFiel } from './routes/clienteFiel.routes.js'
import { BodegasMongoDB } from './routes/Bodegas.Routes.js'
import { RutasMetas } from './routes/metas.routes.js'
import { ItemsMongoDB } from './routes/Items.Routes.js'
import { ChatBoot } from './routes/chatBoot.routes.js'
import { LoginUser } from './routes/users.routes.js'

import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://172.20.1.216',
  'http://172.20.1.160',
  'http://172.20.1.110:5173',
  'http://localhost'
]

const app = express()

app.disable('x-powered-by')
const PORT = process.env.PUERTO_API || 3000

app.use(cors({
  credentials: true,
  origin: ACCEPTED_ORIGINS
}))

app.use(morgan('dev'))

app.use(cookieParser())
app.use(express.json())

// TODO: Metodos Metas PDV

app.use(RutasMetas)

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
