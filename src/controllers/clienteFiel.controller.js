import { obtenerFechaActual, sendEmail, separarNombre } from '../services/funtionsReutilizables.js'
import { validateClientUser } from '../../schemas/userSchema.js'
import { connectOraDb } from '../db.js'

export const getClientFiel = async (req, res) => {
  const { cc } = req.body
  const result = await connectOraDb.execute(`SELECT * FROM gamble.clientes WHERE documento = '${cc}'`)
  if (result.rows.length === 1) {
    res.status(200).json({ user: `${cc}`, Estado: 'Si Existe' })
  } else {
    res.status(404).json({ user: `${cc}`, Estado: 'No Existe' })
  }
}

export const createdClientFiel = async (req, res) => {
  const { cedula, nombre, telefono, correo, sexo } = req.body
  const { dia, mes, ano } = obtenerFechaActual()
  const sexoCliente = parseInt(sexo)
  const { nombre1, nombre2, apellido1, apellido2 } = separarNombre(nombre)

  const result = validateClientUser({ nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula, sexoCliente })
  // Response client ok !!!
  if (!result.success) {
    return res.status(400).json({ error: result.error.message })
  }

  try {
    const result = await connectOraDb.execute(`Insert into GAMBLE.CLIENTES (DOCUMENTO,TOTALPUNTOS,USUARIO,FECHASYS,NOMBRES,APELLIDO1,APELLIDO2,FECHANACIMIENTO,TELEFONO,DIRECCION,TIPO_DEPTO,CODDEPTO,TIPO_MUNICIPIO,CODMUNICIPIO,ENT_SEXO,DAT_DTO_SEXO,DOCALTERNO,NRO_FAVORITO,
      VERSION,CCOSTO,MAIL,NOMBRE1,NOMBRE2,CELULAR,ACEPTAPOLITICATDP,CLIENTEVENDEDOR,CLAVECANAL,TPOTRT_CODIGO_NACION,TRT_CODIGO_NACION,TPOTRT_CODIGO_EXPDOC,TRT_CODIGO_EXPDOC,FECHAEXPDOC,DTO_CODIGO_TPDOC,ENT_CODIGO_TPDOC,IDLOGIN,SECURITY_TOKEN) 
      values ('${cedula}','u+#ajÕ','CP1118307852',to_date('${dia}/${mes}/${ano}','DD/MM/RR'),'${nombre1} ${nombre2}','${apellido1}','${apellido2}',to_date('01/01/97','DD/MM/RR'),'6696901','Cra 4 # 4-51','6','30','8','965','60','${sexoCliente}','${cedula}','','0','0','${correo}', '${nombre1}', '${nombre2}', '${telefono}','S', 'N','CHATBOOT', '2', '1','8','76892', to_date('01/01/15','DD/MM/RR'), '35', '70', null,null)`)

    await connectOraDb.commit()

    if (result.rowsAffected === 1) {
      const userCreado = { nombre, cedula, telefono, correo }
      sendEmail({ userCreado }) // Envío De Correo Al Cliente
      res.status(201).json({ success: true, message: 'Commit successfully committed', user: 'Usuario Creado' })
    } else {
      res.status(500).json({ success: false, message: 'Commit failed committed', user: 'Usuario No Creado' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Commit error committed', detail: 'Celular Ya Existe ... Verificar Número, Edite Usuario' })
  }
}
