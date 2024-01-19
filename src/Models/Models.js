import { Schema, model } from 'mongoose'

const SimcardSchema = new Schema({
  numero: { type: String, unique: true },
  operador: { type: String, required: true, enum: ['Claro', 'Movistar', 'Tigo'] },
  estado: { type: String, required: true, enum: ['Activa', 'Inactiva', 'DeBaja', 'Reposición'] },
  serial: { type: String, required: true, unique: true },
  apn: { type: String, required: true },
  user: { type: String },
  pass: { type: String }
}, { timestamps: true, versionKey: false })

const ItemSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
  serial: { type: String, required: true, unique: true },
  estado: { type: String, required: true, enum: ['Nuevo', 'Bueno', 'Malo', 'DeBaja'] }
}, { timestamps: true, versionKey: false })

const bodegaSchema = new Schema({
  nombre: { type: String, required: true },
  sucursal: { type: Number, required: true, unique: true },
  direccion: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  simcards: [{ type: Schema.Types.ObjectId, ref: 'simcard' }]
}, { timestamps: true, versionKey: false })

const movimientoSchema = new Schema({
  movimientoId: { type: Number },
  encargado: { type: String, required: true },
  incidente: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  fecha: { type: Date, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  bodegaOrigen: { type: Schema.Types.ObjectId, ref: 'bodega' },
  bodegaDestino: { type: Schema.Types.ObjectId, ref: 'bodega' },
  simcards: { entran: [{ type: Schema.Types.ObjectId, ref: 'simcard' }], salen: [{ type: Schema.Types.ObjectId, ref: 'simcard' }] }
}, { timestamps: true, versionKey: false })

export const ItemModel = model('Item', ItemSchema)
export const BodegaModel = model('bodega', bodegaSchema)
export const MovimientoModel = model('movimiento', movimientoSchema)
export const SimcardModel = model('simcard', SimcardSchema)
