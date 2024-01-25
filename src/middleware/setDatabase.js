import { ConnetMongoDB, ConnetMongoServired } from '../connections/mongoDb.js'

export const setDatabaseConnection = async (req, res, next) => {
  const company = req.params.company || req.body.company
  if (!company) {
    return res.status(400).send('La compañía no fue proporcionada')
  }

  try {
    if (company === 'multired') {
      await ConnetMongoDB()
    } else if (company === 'servired') {
      await ConnetMongoServired()
    } else {
      return res.status(400).send('Compañía no reconocida')
    }
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error al conectar a la base de datos')
  }

  next()
}
