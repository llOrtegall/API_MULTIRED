import { Schema, model } from 'mongoose'

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number
  }
})

export const ItemModel = model('item', itemSchema)
