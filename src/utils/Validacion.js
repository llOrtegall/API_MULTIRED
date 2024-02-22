export function validateEnvVariables () {
  const requiredVariables = [
    'PUERTO_API',
    'ORACLE_ROUTE',
    'USER_NAME',
    'PASS_WORD',
    'CONECT_STRING',
    'HOSTMYSQL',
    'USUARIO',
    'PASSWORD',
    'PUERTO',
    'NAME_DATABASE',
    'MYSQLLOGIN',
    'USR',
    'PASS',
    'PORT',
    'DATABASE',
    'JWT_SECRET',
    'EMAIL_SEND_REPORTS',
    'EMAIL_USER',
    'EMAIL_PASS',
    'METAS_HOST',
    'METAS_USER',
    'METAS_PASS',
    'METAS_PORT',
    'METAS_DATABASE'
  ]

  const undefinedVariables = requiredVariables.filter(variable => !process.env[variable])

  if (undefinedVariables.length > 0) {
    throw new Error(`Las siguientes variables de entorno no están definidas: ${undefinedVariables.join(', ')}`)
  } else {
    console.log('Todas las variables de entorno están definidas')
  }
}
