import { ConnetMongoDB } from '../connections/mongoDb.js'
import { ItemModel, BodegaModel, MovimientoModel } from '../../Models/Item.Model.js'

export const createItem = async (req, res) => {
  try {
    const { nombre, descripcion, placa, serial, estado, bodega } = req.body

    // Validar los datos de entrada
    if (!nombre || !descripcion || !placa || !serial || !estado || !bodega) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    await ConnetMongoDB()

    const newItem = new ItemModel({ nombre, descripcion, placa, serial, estado, bodega })
    await newItem.save()
    res.status(201).json(newItem)
  } catch (error) {
    console.error(error)
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
  try {
    const { nombre, sucursal, direccion } = req.body

    // Validar los datos de entrada
    if (!nombre || !sucursal || !direccion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    await ConnetMongoDB()

    const newBodega = new BodegaModel({ nombre, sucursal, direccion })
    await newBodega.save()
    res.status(201).json(newBodega)
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

  console.log(itemId)

  try {
    await ConnetMongoDB()
    // Encuentra el ítem por su ID
    const item = await ItemModel.findById(itemId)
    console.log(item)
    if (!item) {
      console.log('No se encontró el ítem con el ID proporcionado')
      res.status(404).json({ error: 'No se encontró el ítem con el ID proporcionado' })
      return
    }

    // Encuentra la bodega por su ID y agrega el ítem al array de items
    const bodega = await BodegaModel.findOneAndUpdate(
      { sucursal },
      { $push: { items: item } },
      { new: true, useFindAndModify: false }
    )

    if (!bodega) {
      res.status(404).json({ error: 'No se encontró la bodega con el ID proporcionado' })
      return
    }

    res.status(200).json(bodega)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al agregar el ítem a la bodega' })
  }
}

export const findBodegaWithItems = async (req, res) => {
  const { itemId } = req.body

  try {
    await ConnetMongoDB()
    // Encuentra la bodega que contiene el ítem con el ID proporcionado
    const bodega = await BodegaModel.findOne({ 'items._id': itemId })

    if (!bodega) {
      res.status(404).json({ error: 'No se encontró una bodega con el ítem con el ID proporcionado' })
      return
    }

    res.status(200).json(bodega)
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
