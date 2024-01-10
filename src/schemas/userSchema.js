import z from 'zod'

const User = z.object({
  nombres: z.string({
    invalid_type_error: 'El nombre debe ser un texto',
    required_error: 'El nombre es requerido'
  }),
  apellidos: z.string({
    invalid_type_error: 'El apellido debe ser un texto',
    required_error: 'El apellido es requerido'
  }),
  documento: z.number({
    invalid_type_error: 'El documento debe ser un número',
    required_error: 'El documento es requerido'
  }),
  telefono: z.number({
    invalid_type_error: 'El telefono debe ser un número',
    required_error: 'El telefono es requerido'
  }),
  correo: z.string({
    invalid_type_error: 'El correo debe ser un texto',
    required_error: 'El correo es requerido'
  }).email({
    message: 'El correo no es valido'
  }),
  empresa: z.number({
    invalid_type_error: 'La empresa debe ser un número',
    required_error: 'La empresa es requerida'
  }).int().min(0).max(2),
  proceso: z.number({
    invalid_type_error: 'El proceso debe ser un número', required_error: 'El proceso es requerido'
  }).int().min(0).max(9),
  rol: z.string({
    invalid_type_error: 'El rol debe ser un texto',
    required_error: 'El rol es requerido'
  })
})

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
  sexoCliente: z.number({ required_error: 'Se Necesita un Sexo' }),
  empresa: z.string({ required_error: 'Se Necesita una Empresa' })
})

export function validateUser (object) {
  return userSchema.safeParse(object)
}

export function validateClientUser (object) {
  return userClientSchema.safeParse(object)
}

export function ValidarUsuario (object) {
  return User.safeParseAsync(object)
}
