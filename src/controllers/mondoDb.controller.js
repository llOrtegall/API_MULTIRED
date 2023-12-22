import { ConnetMongoDB } from '../connections/mongoDb.js'
import { ItemModel } from '../../Models/Item.Model.js'

export const createItem = async (req, res) => {
  const { name, price } = req.body
  await ConnetMongoDB()
  const newItem = new ItemModel({ name, price })
  await newItem.save()
  res.json({ message: 'Item created' })
}
