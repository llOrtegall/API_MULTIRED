import { BodegaModel, SimcardModel } from '../Models/Models.js'
import { ConnetMongoDB } from '../Connections/mongoDb.js'

export const createSimcard = async (req, res) => {
  const { numero, operador, estado, serial, apn, user, pass } = req.body

  if (!numero || !operador || !estado || !serial || !user || !pass) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  if (operador !== 'Claro' && operador !== 'Movistar' && operador !== 'Tigo') {
    return res.status(400).json({ error: 'Operador no valido' })
  }

  if (estado !== 'Activa' && estado !== 'Inactiva' && estado !== 'DeBaja') {
    return res.status(400).json({ error: 'Estado no valido' })
  }

  try {
    await ConnetMongoDB()
    const simcard = new SimcardModel({ numero, operador, estado, serial, apn, user, pass })
    await simcard.save()
    res.status(201).json(simcard)
  } catch (error) {
    console.error(error)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]
      const value = error.keyValue[field]
      return res.status(400).json({ error: `El Campo: ${field} con el Valor: ${value} ya existe` })
    }
    res.status(500).json({ error: 'Error al crear la simcard' })
  }
}

export const getSimcard = async (req, res) => {

}

export const getSimcardWhitBodega = async (req, res) => {
  try {
    await ConnetMongoDB()

    const simcards = await SimcardModel.find()
    const bodegas = await BodegaModel.find().populate('simcards')

    const bodegasMap = bodegas.reduce((map, bodega) => {
      bodega.simcards.forEach(item => {
        map[item._id.toString()] = { nombre: bodega.nombre, sucursal: bodega.sucursal, _id: bodega._id }
      })
      return map
    }, {})

    const itemsWithBodegas = simcards.map(item => ({
      ...item._doc,
      bodega: bodegasMap[item._id.toString()] || 'No Asignado'
    }))

    res.status(200).json(itemsWithBodegas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los ítems y las bodegas' })
  }
}

export const addSimcardToBodega = async (req, res) => {
  const { sucursal, simcardIds } = req.body

  if (!sucursal || !simcardIds) {
    res.status(400).json({ error: 'Faltan campos requeridos' })
    return
  }

  try {
    await ConnetMongoDB()
    const bodega = await BodegaModel.findOne({ sucursal })
    if (!bodega) {
      res.status(404).json({ error: 'No se encontró la bodega con la sucursal proporcionada' })
      return
    }
    const simcards = await SimcardModel.find({ _id: { $in: simcardIds } })
    if (simcards.length !== simcardIds.length) {
      res.status(404).json({ error: 'Algunas tarjetas SIM no se encontraron' })
      return
    }
    const existingBodega = await BodegaModel.findOne({ simcards: { $in: simcardIds } })
    if (existingBodega) {
      res.status(400).json({ error: 'Algunas tarjetas SIM ya están en otra bodega' })
      return
    }
    bodega.simcards.push(...simcards.map(simcard => simcard._id))
    await bodega.save()

    res.status(200).json({ message: `Simcard(s) agregadas correctamente a Bodega: ${sucursal}` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al agregar los ítems a bodega', message: error })
  }
}

// TODo: Movimientos de simcards
export const CrearMovimientoSimcard = async (req, res) => {

}
