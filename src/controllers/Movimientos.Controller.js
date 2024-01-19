import { BodegaModel, MovimientoModel } from '../Models/Models.js'
import { ConnetMongoDB } from '../Connections/mongoDb.js'
import moment from 'moment-timezone'

export const getMovimientos = async (req, res) => {
  try {
    await ConnetMongoDB()
    const movimientos = await MovimientoModel.find().populate('items').populate('bodegaOrigen').populate('bodegaDestino').populate('simcards.entran').populate('simcards.salen')
    res.status(200).json(movimientos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los movimientos' })
  }
}

export const moveItems = async (req, res) => {
  const { itemsIds, bodegaOrigen, bodegaDestino, encargado, incidente, descripcion } = req.body

  if (!itemsIds || !bodegaOrigen || !bodegaDestino || !encargado || !incidente || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  if (itemsIds.length === 0) {
    return res.status(400).json({ error: 'Debe seleccionar al menos un ítem' })
  }

  if (bodegaOrigen === bodegaDestino) {
    return res.status(400).json({ error: 'La bodega de Origen y Destino deben ser Diferentes' })
  }

  try {
    await ConnetMongoDB()
    // Encuentra las bodegas
    const sourceBodega = await BodegaModel.findById(bodegaOrigen)
    const targetBodega = await BodegaModel.findById(bodegaDestino)

    // Verifica si las bodegas existen
    if (!sourceBodega || !targetBodega) {
      return res.status(404).json({ error: 'No se encontró una o ambas bodegas' })
    }

    // Mueve cada ítem del array itemsIdsmoveItems
    for (const itemId of itemsIds) {
      // Encuentra el ítem en la bodega original
      const itemIndex = sourceBodega.items.findIndex(item => item._id.toString() === itemId)

      // Verifica si el ítem existe en la bodega original
      if (itemIndex === -1) {
        return res.status(404).json({ error: `No se encontró el ítem con id ${itemId} en la bodega original` })
      }

      // Elimina el ítem de la bodega original
      const [item] = sourceBodega.items.splice(itemIndex, 1)

      // Agrega el ítem a la bodega de destino
      targetBodega.items.push(item)
    }

    const movimientoId = await MovimientoModel.countDocuments() + 1

    // Crea el movimiento
    const movimiento = new MovimientoModel({
      movimientoId,
      encargado,
      incidente,
      descripcion,
      fecha: moment().tz('America/Bogota').toDate(),
      items: itemsIds,
      bodegaOrigen,
      bodegaDestino
    })
    // Guarda el movimiento
    await movimiento.save()

    // Guarda los cambios en las bodegas
    await sourceBodega.save()
    await targetBodega.save()

    res.status(200).json({ message: 'Ítems movidos con éxito' })
  } catch (error) {
    if (error.code === 11000) {
      console.log(error)
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!!` })
    }
    res.status(500).json({ error: 'Error al mover los ítems' })
  }
}

export const moveSimcards = async (req, res) => {
  const { simsIds, bodegas, encargado, incidente, descripcion } = req.body

  console.log(simsIds); console.log(bodegas); console.log(encargado); console.log(incidente); console.log(descripcion)

  if (!simsIds || !bodegas || !encargado || !incidente || !descripcion) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  if (simsIds.entran.length === 0) {
    return res.status(400).json({ error: 'Debe seleccionar al menos un ítem Para El Movimiento' })
  }

  if (bodegas.bodegaOrigen === bodegas.bodegaDestino) {
    return res.status(400).json({ error: 'La bodega de Origen y Destino deben ser Diferentes' })
  }

  try {
    await ConnetMongoDB()
    // Encuentra las bodegas
    const sourceBodega = await BodegaModel.findById(bodegas.bodegaOrigen)
    const targetBodega = await BodegaModel.findById(bodegas.bodegaDestino)

    // Mueve cada ítem del array itemsIdsmoveItems
    for (const itemId of simsIds.entran) {
      // Encuentra el ítem en la bodega original
      const itemIndex = sourceBodega.simcards.findIndex(item => item._id.toString() === itemId)

      // Elimina el ítem de la bodega original
      const [item] = sourceBodega.simcards.splice(itemIndex, 1)

      // Agrega el ítem a la bodega de destino
      targetBodega.simcards.push(item)
    }

    for (const itemid of simsIds.salen) {
      // Encuentra el ítem en la bodega original
      const itemIndex = targetBodega.simcards.findIndex(item => item._id.toString() === itemid)

      // Elimina el ítem de la bodega original
      const [item] = targetBodega.simcards.splice(itemIndex, 1)

      // Agrega el ítem a la bodega de destino
      sourceBodega.simcards.push(item)
    }
    const movimientoId = await MovimientoModel.countDocuments() + 1

    const movimiento = new MovimientoModel({
      movimientoId,
      encargado,
      incidente,
      descripcion,
      fecha: moment().tz('America/Bogota').toDate(),
      items: [],
      simcards: simsIds,
      bodegaOrigen: bodegas.bodegaOrigen,
      bodegaDestino: bodegas.bodegaDestino
    })

    await movimiento.save()

    // Guarda los cambios en las bodegas
    await sourceBodega.save()
    await targetBodega.save()

    res.status(200).json({ message: 'Ítems movidos con éxito' })
  } catch (error) {
    if (error.code === 11000) {
      console.log(error)
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!!` })
    }
    res.status(500).json({ error: 'Error al mover los ítems' })
  }
}

export const getMovimiento = async (req, res) => {
  const { id } = req.params
  try {
    await ConnetMongoDB()
    const movimiento = await MovimientoModel.findById(id).populate('items')
      .populate('bodegaOrigen', 'sucursal nombre direccion')
      .populate('bodegaDestino', 'sucursal nombre direccion')
      .populate('simcards.entran', 'numero operador serial estado').populate('simcards.salen', 'numero operador serial estado')
    res.status(200).json(movimiento)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el movimiento' })
  }
}
