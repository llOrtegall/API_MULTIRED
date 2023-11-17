import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://172.20.1.160',
  'http://localhost:3000'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  credentials: true,
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
})