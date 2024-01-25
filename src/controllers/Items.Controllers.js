import { ItemModel } from '../Models/Models.js'

export const getItems = async (req, res) => {
  try {
    const items = await ItemModel.find()
    return res.status(200).json(items)
  } catch (error) {
    console.error(error)
    return res.status(500).send('Error al obtener los items')
  }
}

export const createItem = async (req, res) => {
  const { nombre, descripcion, placa, serial, estado, company } = req.body

  try {
    // Validar los datos de entrada
    if (!nombre || !descripcion || !placa || !serial || !estado) {
      throw new Error('Faltan campos requeridos')
    }

    const plateRegex = company === 'multired' ? /^MI-\d{1,5}$|^MA-\d{1,5}$/ : /^SI-\d{1,5}$|^SA-\d{1,5}$/
    const plateError = company === 'multired' ? 'La placa debe comenzar con "MI-" o "MA-" seguido de un número de hasta 5 dígitos' : 'La placa debe comenzar con "SI-" o "SA-" seguido de un número de hasta 5 dígitos'

    if (!plateRegex.test(placa)) {
      throw new Error(plateError)
    }

    const newItem = new ItemModel({ nombre, descripcion, placa, serial, estado })
    await newItem.save()
    return res.status(201).json({ message: 'Ítem creado correctamente' })
  } catch (error) {
    console.log(error)

    if (error.code === 11000) {
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400).json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!! ` })
    }

    return res.status(500).json({ error: error.message || 'Error al crear el ítem' })
  }
}

export const updateItem = async (req, res) => {
  const { id, descripcion, estado, placa, serial, company } = req.body

  try {
    // Validar los datos de entrada
    if (!id || !descripcion || !placa || !serial || !estado) {
      throw new Error('Faltan campos requeridos')
    }

    const plateRegex = company === 'multired' ? /^MI-\d{1,5}$|^MA-\d{1,5}$/ : /^SI-\d{1,5}$|^SA-\d{1,5}$/
    const plateError = company === 'multired' ? 'La placa debe comenzar con "MI-" o "MA-" seguido de un número de hasta 5 dígitos' : 'La placa debe comenzar con "SI-" o "SA-" seguido de un número de hasta 5 dígitos'

    if (!plateRegex.test(placa)) {
      throw new Error(plateError)
    }

    const item = await ItemModel.findOneAndUpdate({ _id: id }, { descripcion, estado, placa, serial }, { new: true })

    if (!item) {
      throw new Error('Item no encontrado')
    }

    return res.status(200).json({ message: 'Item actualizado correctamente' })
  } catch (error) {
    console.log(error)

    if (error.code === 11000) {
      const Code = error.code
      const name = Object.keys(error.keyValue)[0]
      const Value = error.keyValue[Object.keys(error.keyValue)[0]]
      return res.status(400).json({ error: `Error: ${Code}, ${name} = ${Value} Ya Existe !!! ` })
    }

    return res.status(500).json({ error: error.message || 'Error al actualizar el ítem' })
  }
}

export const deleteItem = async (req, res) => {
  const { id, company } = req.params

  try {
    // Validar los datos de entrada
    if (!id || !company) {
      throw new Error('Falta el ID del ítem o la compañía')
    }

    const item = await ItemModel.findByIdAndDelete(id)

    if (!item) {
      throw new Error('Ítem no encontrado')
    }

    return res.status(200).json({ message: 'Ítem eliminado correctamente' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message || 'Error al eliminar el ítem' })
  }
}
