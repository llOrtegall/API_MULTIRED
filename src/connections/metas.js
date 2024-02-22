import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.METAS_HOST,
  user: process.env.METAS_USER,
  password: process.env.METAS_PASS,
  port: process.env.METAS_PORT,
  database: process.env.METAS_DATABASE
})
