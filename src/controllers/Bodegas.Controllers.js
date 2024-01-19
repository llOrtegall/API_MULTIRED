import { BodegaModel, ItemModel } from '../Models/Models.js'
import { ConnetMongoDB } from '../Connections/mongoDb.js'

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
    if (error.code === 11000) {
      const Code = error.code
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, La Bodega Con N° Sucursal: ${Value} Ya Existe ¡¡¡` })
    }
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

export const getBodegasSim = async (req, res) => {
  try {
    await ConnetMongoDB()
    const bodegas = await BodegaModel.find().populate('simcards')
    res.status(200).json(bodegas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener las bodegas' })
  }
}

export const getBodegaSucursal = async (req, res) => {
  const { sucursal } = req.params
  try {
    await ConnetMongoDB()
    const bodega = await BodegaModel.findOne({ sucursal }).populate('items')
    res.status(200).json(bodega)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener la bodega' })
  }
}

export const getBodegaSucursalSimcards = async (req, res) => {
  const { sucursal } = req.params
  try {
    await ConnetMongoDB()
    const bodega = await BodegaModel.findOne({ sucursal }).populate('simcards')
    res.status(200).json(bodega)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener la bodega' })
  }
}

export const findBodegaWithItems = async (req, res) => {
  try {
    await ConnetMongoDB()

    const items = await ItemModel.find()
    const bodegas = await BodegaModel.find().populate('items')

    const bodegasMap = bodegas.reduce((map, bodega) => {
      bodega.items.forEach(item => {
        map[item._id.toString()] = { nombre: bodega.nombre, sucursal: bodega.sucursal, _id: bodega._id }
      })
      return map
    }, {})

    const itemsWithBodegas = items.map(item => ({
      ...item._doc,
      bodega: bodegasMap[item._id.toString()] || 'No Asignado'
    }))

    res.status(200).json(itemsWithBodegas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener los ítems y las bodegas' })
  }
}

export const addItemToBodega = async (req, res) => {
  const { sucursal, itemIds } = req.body

  if (!sucursal || !itemIds) {
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

    for (const itemId of itemIds) {
      const item = await ItemModel.findById(itemId)
      if (!item) {
        res.status(404).json({ error: `No se encontró el ítem con el ID: ${itemId}` })
        return
      }

      // Verifica si el ítem ya está en alguna bodega
      const existingBodega = await BodegaModel.findOne({ items: itemId })
      if (existingBodega) {
        res.status(400).json({ error: `El ítem con el ID: ${itemId} ya está en otra bodega` })
        return
      }

      bodega.items.push(item._id)
    }

    await bodega.save()
    res.status(200).json({ message: `Ítems agregados correctamente a Bodega: ${sucursal}` })
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar los ítems a bodega', message: error })
  }
}

export const getBodegaSucursalItemsSimcards = async (req, res) => {
  const { id } = req.params
  try {
    await ConnetMongoDB()
    const bodega = await BodegaModel.findById(id).populate('items').populate('simcards')
    res.status(200).json(bodega)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener la bodega' })
  }
}
