import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { htmlSend } from './htmlSend.js'
import { htmlCreatedUser, htmlCreatedUserServired, forgotPasswordEmail } from './htmlCreatedUser.js'

dotenv.config()

export function consultaTable (select) {
  if (select === 'Multired') {
    return 'personayumbo'
  } else if (select === 'Servired') {
    return 'personajamundi'
  }
}

export function separarNombre (nombre) {
  const nombres = nombre.split(' ', 4)

  let nombre1, nombre2, apellido1, apellido2

  switch (nombres.length) {
    case 2:
      nombre1 = nombres[0]
      nombre2 = ''
      apellido1 = nombres[1]
      apellido2 = ''
      break
    case 3:
      nombre1 = nombres[0]
      nombre2 = nombres[1]
      apellido1 = nombres[2]
      apellido2 = ''
      break
    case 4:
      nombre1 = nombres[0]
      nombre2 = nombres[1]
      apellido1 = nombres[2]
      apellido2 = nombres[3]
      break
    default:
      console.log('Nombre no válido')
      break
  }
  return { nombre1, nombre2, apellido1, apellido2 }
}

export function obtenerFechaActual () {
  const fecha = new Date()
  const dia = String(fecha.getDate()).padStart(2, '0')
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const ano = fecha.getFullYear().toString().substr(-2)
  return { dia, mes, ano }
}

export async function sendEmail ({ userCreado }) {
  console.log(userCreado)
  const { nombre, cedula, telefono, correo } = userCreado

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${correo}, asistentecomercial@grupomultired.com.co`,
    subject: 'Usuario Cliente Fiel Creado',
    html: htmlCreatedUser({ nombre, cedula, telefono })
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(info)
  console.log(`Se envia correo a ${correo}`)
}

export async function resportEmail ({ data }) {
  const { nombre, cedula, telefono } = data.client
  const { motivo, emp } = data

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_SEND_REPORTS,
    subject: 'Solicitud Elimación Registro Chat Boot',
    html: htmlSend({ nombre, cedula, telefono, motivo, emp })
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(info)
}

export async function sendEmailServired ({ userCreado }) {
  console.log(userCreado)
  const { nombre, cedula, telefono, correo } = userCreado

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${correo}, asistentecomercial@gruposervired.com.co`,
    subject: 'Usuario Cliente Fiel Creado',
    html: htmlCreatedUserServired({ nombre, cedula, telefono })
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(info)
  console.log(`Se envia correo a ${correo}`)
}

export async function forgotPasswordSend ({ user, token }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_SEND_REPORTS,
    subject: 'Solicitud Cambio de Contraseña',
    html: forgotPasswordEmail({ user, token })
  }

  await transporter.sendMail(mailOptions)
  console.log('Se Ha Solicitado Un Reinicio De Contraseña')
}
