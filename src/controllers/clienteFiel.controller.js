import { obtenerFechaActual, sendEmail, sendEmailServired, separarNombre } from '../services/funtionsReutilizables.js'
import { validateClientUser } from '../../schemas/userSchema.js'
import { conectOraDB } from '../connections/oracleDB.js'
import { logger } from '../services/logsApp.js'

export const getClientFiel = async (req, res) => {
  const { ccs } = req.body

  const pool = await conectOraDB()
  const connection = await pool.getConnection()

  try {
    const promises = ccs.map(cc =>
      connection.execute('SELECT documento FROM gamble.clientes WHERE documento = :cc', { cc })
        .then(({ rows }) => ({ Estado: rows.length === 1 ? 'Si Existe' : 'No Existe' }))
    )
    const results = await Promise.all(promises)
    res.status(200).json(results)
  } catch (error) {
    logger.error('Error al ejecutar la consulta', error)
    res.status(500).json({ message: 'Error al obtener los clientes' })
  } finally {
    await connection.close()
    await pool.close()
  }
}

export const createdClientFiel = async (req, res) => {
  const { cedula, nombre, telefono, correo, sexo, empresa } = req.body
  console.log(req.body)
  const { dia, mes, ano } = obtenerFechaActual()
  const sexoCliente = parseInt(sexo)
  const { nombre1, nombre2, apellido1, apellido2 } = separarNombre(nombre)

  const result = validateClientUser({ nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula, sexoCliente, empresa })

  if (!result.success) {
    return res.status(400).json({ error: result.error.message })
  }

  const pool = await conectOraDB()
  const connection = await pool.getConnection()

  if (empresa === 'Multired') {
    try {
      const result = await connection.execute(
        `Insert into GAMBLE.CLIENTES (DOCUMENTO,TOTALPUNTOS,USUARIO,FECHASYS,NOMBRES,APELLIDO1,APELLIDO2,FECHANACIMIENTO,TELEFONO,DIRECCION,TIPO_DEPTO,CODDEPTO,TIPO_MUNICIPIO,CODMUNICIPIO,ENT_SEXO,DAT_DTO_SEXO,DOCALTERNO,NRO_FAVORITO,
          VERSION,CCOSTO,MAIL,NOMBRE1,NOMBRE2,CELULAR,ACEPTAPOLITICATDP,CLIENTEVENDEDOR,CLAVECANAL,TPOTRT_CODIGO_NACION,TRT_CODIGO_NACION,TPOTRT_CODIGO_EXPDOC,TRT_CODIGO_EXPDOC,FECHAEXPDOC,DTO_CODIGO_TPDOC,ENT_CODIGO_TPDOC,IDLOGIN,SECURITY_TOKEN) 
          values (:cedula,'u+#ajÕ','CP1118307852',to_date(:fechaActual,'DD/MM/RR'),:nombres,:apellido1,:apellido2,to_date('01/01/97','DD/MM/RR'),'6696901','Cra 4 # 4-51','6','30','8','965','60',:sexoCliente,:cedula,'','0','0',:correo, :nombre1, :nombre2, :telefono,'S', 'N','CHATBOOT', '2', '1','8','76892', to_date('01/01/15','DD/MM/RR'), '35', '70', null,null)`,
        { cedula, fechaActual: `${dia}/${mes}/${ano}`, nombres: `${nombre1} ${nombre2}`, apellido1, apellido2, sexoCliente, correo, nombre1, nombre2, telefono }
      )
      await connection.commit()
      if (result.rowsAffected === 1) {
        const userCreado = { nombre, cedula, telefono, correo }
        sendEmail({ userCreado }) // Envío De Correo Al Cliente
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' })
      }
    } catch (error) {
      await connection.rollback() // Deshacer los cambios en caso de error
      logger.error('Ocurrió un error al crear el usuario: ', error)
      return res.status(500).json({ message: 'Ocurrió un error al crear el usuario, consulte con el admin' })
    } finally {
      await connection.close()
      await pool.close()
    }
  } else if (empresa === 'Servired') {
    try {
      const result = await connection.execute(
        `Insert into GAMBLE.CLIENTES (DOCUMENTO,TOTALPUNTOS,USUARIO,FECHASYS,NOMBRES,APELLIDO1,APELLIDO2,FECHANACIMIENTO,TELEFONO,DIRECCION,TIPO_DEPTO,CODDEPTO,TIPO_MUNICIPIO,CODMUNICIPIO,ENT_SEXO,DAT_DTO_SEXO,DOCALTERNO,NRO_FAVORITO,
          VERSION,CCOSTO,MAIL,NOMBRE1,NOMBRE2,CELULAR,ACEPTAPOLITICATDP,CLIENTEVENDEDOR,CLAVECANAL,TPOTRT_CODIGO_NACION,TRT_CODIGO_NACION,TPOTRT_CODIGO_EXPDOC,TRT_CODIGO_EXPDOC,FECHAEXPDOC,DTO_CODIGO_TPDOC,ENT_CODIGO_TPDOC,IDLOGIN,SECURITY_TOKEN) 
          values (:cedula,'u+#ajÕ','CP1118307852',to_date(:fechaActual,'DD/MM/RR'),:nombres,:apellido1,:apellido2,to_date('01/01/97','DD/MM/RR'),'5190869','CR 10 # 12 25','6','30','8','385','60',:sexoCliente,:cedula,'','0','0',:correo, :nombre1, :nombre2, :telefono,'S', 'N','CHATBOOT', '2', '1','8','76364', to_date('01/01/15','DD/MM/RR'), '35', '70', null,null)`,
        { cedula, fechaActual: `${dia}/${mes}/${ano}`, nombres: `${nombre1} ${nombre2}`, apellido1, apellido2, sexoCliente, correo, nombre1, nombre2, telefono }
      )
      await connection.commit()
      if (result.rowsAffected === 1) {
        const userCreado = { nombre, cedula, telefono, correo }
        sendEmailServired({ userCreado }) // Envío De Correo Al Cliente
        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' })
      }
    } catch (error) {
      await connection.rollback() // Deshacer los cambios en caso de error
      logger.error('Ocurrió un error al crear el usuario: ', error)
      return res.status(500).json({ message: 'Ocurrió un error al crear el usuario, consulte con el admin' })
    } finally {
      await connection.close()
      await pool.close()
    }
  }
}
