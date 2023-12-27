import { Schema, model } from 'mongoose'

const itemSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
  serial: { type: String, required: true, unique: true },
  estado: { type: String, required: true, enum: ['Nuevo', 'Bueno', 'Malo', 'DeBaja'] }
}, { timestamps: true, versionKey: false })

const bodegaSchema = new Schema({
  nombre: { type: String, required: true },
  sucursal: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  items: { type: [itemSchema], required: false }
}, { timestamps: true, versionKey: false })

const movimientoSchema = new Schema({
  encargado: { type: String, required: true },
  incidente: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  tipo: { type: String, required: true, enum: ['Entrada', 'Salida'] },
  item: { type: Schema.Types.ObjectId, ref: 'item' },
  bodega: { type: Schema.Types.ObjectId, ref: 'bodega' }
}, { timestamps: true, versionKey: false })

export const ItemModel = model('item', itemSchema)
export const BodegaModel = model('bodega', bodegaSchema)
export const MovimientoModel = model('movimiento', movimientoSchema)
