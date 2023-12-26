import { ConnetMongoDB } from '../connections/mongoDb.js'
import { ItemModel, BodegaModel, MovimientoModel } from '../../Models/Models.js'

export const createItem = async (req, res) => {
  try {
    const { nombre, descripcion, placa, serial, estado } = req.body

    if (!/^MI-|^MA-/.test(placa)) {
      return res.status(400).json({ error: 'La placa debe comenzar con "MI-" o "MA-"' })
    }

    // Validar los datos de entrada
    if (!nombre || !descripcion || !placa || !serial || !estado) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    await ConnetMongoDB()

    const newItem = new ItemModel({ nombre, descripcion, placa, serial, estado })
    await newItem.save()
    res.status(201).json({ message: 'Ítem creado correctamente' })
  } catch (error) {
    console.log(error)

    if (error.code === 11000) {
      const Code = error.code
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, El Item ${Value} Ya Existe` })
    }

    res.status(500).json({ error: 'Error al crear el ítem' })
  }
}

export const getItems = async (req, res) => {
  try {
    await ConnetMongoDB()
    const items = await ItemModel.find()
    res.status(200).json(items)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los ítems' })
  }
}

export const createBodega = async (req, res) => {
  const { nombre, sucursal, direccion } = req.body
  try {
    // Validar los datos de entrada
    if (!nombre || !sucursal || !direccion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    await ConnetMongoDB()

    const newBodega = new BodegaModel({ nombre, sucursal, direccion })
    await newBodega.save()
    res.status(201).json({ message: 'Bodega creada correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la bodega' })
  }
}

export const getBodegas = async (req, res) => {
  try {
    await ConnetMongoDB()
    const bodegas = await BodegaModel.find()
    res.status(200).json(bodegas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener las bodegas' })
  }
}

export const addItemToBodega = async (req, res) => {
  const { sucursal, itemId } = req.body

  try {
    await ConnetMongoDB()
    // Encuentra el ítem por su ID
    const item = await ItemModel.findById(itemId)

    if (!item) {
      res.status(404).json({ error: 'No se encontró el ítem con el ID proporcionado' })
      return
    }

    // Encuentra la bodega por su sucursal
    const bodega = await BodegaModel.findOne({ sucursal })

    if (!bodega) {
      res.status(404).json({ error: 'No se encontró la bodega con la sucursal proporcionada' })
      return
    }

    // Verifica si el ítem ya existe en la bodega
    const itemExists = bodega.items.some(existingItem => existingItem._id.toString() === itemId)

    if (itemExists) {
      res.status(400).json({ error: 'El ítem ya existe en la bodega' })
      return
    }

    // Agrega el ítem al array de items
    bodega.items.push(item)
    await bodega.save()

    res.status(200).json({ message: `Ítem agregado correctamente a Bodega: ${sucursal}` })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'El ítem ya está asignado a otra bodega' })
    }
    return res.status(500).json({ error: 'Error al agregar el ítem a bodega', message: error })
  }
}

export const findBodegaWithItems = async (req, res) => {
  const { itemId } = req.body

  try {
    await ConnetMongoDB()
    // Encuentra la bodega que contiene el ítem con el ID proporcionado
    const bodega = await BodegaModel.findOne({ 'items._id': itemId })

    if (!bodega) {
      res.status(200).json({ nombreBodega: 'N/A' })
      return
    }

    res.status(200).json({ nombreBodega: bodega.nombre })
  } catch (error) {
    console.error('Error al buscar la bodega:', error)
    res.status(500).json({ error: 'Error al buscar la bodega' })
  }
}

export const createMovimiento = async (req, res) => {
  try {
    const { encargado, incidente, fecha, tipo, item, bodega } = req.body

    // Validar los datos de entrada
    if (!encargado || !incidente || !fecha || !tipo || !item || !bodega) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    await ConnetMongoDB()

    const newMovimiento = new MovimientoModel({ encargado, incidente, fecha, tipo, item, bodega })
    await newMovimiento.save()
    res.status(201).json(newMovimiento)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear el movimiento' })
  }
}

export const getMovimientos = async (req, res) => {
  try {
    await ConnetMongoDB()
    const movimientos = await MovimientoModel.find()
    res.status(200).json(movimientos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los movimientos' })
  }
}

export const moveItem = async (req, res) => {
  const { itemId, origenBodegaId, bodegaDestinoId } = req.body
  console.log(itemId, origenBodegaId, bodegaDestinoId)

  try {
    await ConnetMongoDB()
    // Encuentra las bodegas
    const sourceBodega = await BodegaModel.findById(origenBodegaId)
    const targetBodega = await BodegaModel.findById(bodegaDestinoId)

    // Verifica si las bodegas existen
    if (!sourceBodega || !targetBodega) {
      return res.status(404).json({ error: 'No se encontró una o ambas bodegas' })
    }

    // Encuentra el ítem en la bodega original
    const itemIndex = sourceBodega.items.findIndex(item => item._id.toString() === itemId)

    // Verifica si el ítem existe en la bodega original
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'No se encontró el ítem en la bodega de Origen' })
    }

    // Elimina el ítem de la bodega original
    const [item] = sourceBodega.items.splice(itemIndex, 1)
    await sourceBodega.save()

    // Agrega el ítem a la bodega de destino
    targetBodega.items.push(item)
    await targetBodega.save()

    res.status(200).json({ message: 'Ítem movido con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al mover el ítem' })
  }
}
