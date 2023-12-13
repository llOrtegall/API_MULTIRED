import oracledb from 'oracledb'

oracledb.initOracleClient({ libDir: process.env.ORACLE_ROUTE })

// TODO: Creando el pool de conexiones a bd Clientes
export const conectOraDB = async () => {
  const pool = await oracledb.createPool({
    user: process.env.USER_NAME,
    password: process.env.PASS_WORD,
    connectString: process.env.CONECT_STRING,
    queueMax: 1,
    queueTimeout: 10000,
    poolMax: 5
  })
  return pool
}
