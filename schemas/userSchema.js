import z from 'zod'

const userSchema = z.object({
  nombre1: z.string({ required_error: 'Se Necesito un Nombre' }).min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  nombre2: z.string(),
  apellido1: z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
  apellido2: z.string(),
  telefono: z.string(),
  correo: z.string(),
  cedula: z.number()
})

const userClientSchema = z.object({
  nombre1: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  nombre2: z.string(),
  apellido1: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  apellido2: z.string(),
  telefono: z.string(),
  correo: z.string(),
  cedula: z.number(),
  sexoCliente: z.number({ required_error: 'Se Necesita un Sexo' })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validateClientUser (object) {
  return userClientSchema.safeParse(object)
}
