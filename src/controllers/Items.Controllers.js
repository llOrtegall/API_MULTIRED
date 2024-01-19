import { ItemModel } from '../Models/Models.js'
import { ConnetMongoDB } from '../Connections/mongoDb.js'

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
      console.log(error)
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!! ` })
    }

    res.status(500).json({ error: 'Error al crear el ítem' })
  }
}

export const updateItem = async (req, res) => {
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
      console.log(error)
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!! ` })
    }

    res.status(500).json({ error: 'Error al crear el ítem' })
  }
}

export const deleteItem = async (req, res) => {
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
      console.log(error)
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400)
        .json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!! ` })
    }

    res.status(500).json({ error: 'Error al crear el ítem' })
  }
}
