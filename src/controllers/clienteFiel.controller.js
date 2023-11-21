import { obtenerFechaActual, sendEmail, separarNombre } from '../services/funtionsReutilizables.js'
import { validateClientUser } from '../../schemas/userSchema.js'
import { createPool2 } from '../db.js'
import { logger } from '../services/logsApp.js'

export const getClientFiel = async (req, res) => {
  const { ccs } = req.body
  let connection
  try {
    if (!ccs || !Array.isArray(ccs)) {
      return res.status(400).json({ message: 'El campo ccs debe ser un array' })
    }

    const pool = await createPool2()
    connection = await pool.getConnection()

    const results = []
    for (const cc of ccs) {
      const { rows } = await connection.execute('SELECT documento FROM gamble.clientes WHERE documento = :cc', { cc })

      if (rows.length === 1) {
        results.push({ user: `${cc}`, Estado: 'Si Existe' })
      } else {
        results.push({ user: `${cc}`, Estado: 'No Existe' })
      }
    }

    res.status(200).json(results)
  } catch (error) {
    logger.error('Error al ejecutar la consulta', error)
    res.status(500).json({ message: 'Error al obtener los clientes' })
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        logger.error('Error al cerrar la conexión:', err)
      }
    }
  }
}

export const createdClientFiel = async (req, res) => {
  const { cedula, nombre, telefono, correo, sexo } = req.body
  const { dia, mes, ano } = obtenerFechaActual()
  const sexoCliente = parseInt(sexo)
  const { nombre1, nombre2, apellido1, apellido2 } = separarNombre(nombre)

  const result = validateClientUser({ nombre1, nombre2, apellido1, apellido2, telefono, correo, cedula, sexoCliente })

  if (!result.success) {
    return res.status(400).json({ error: result.error.message })
  }

  let connection
  try {
    const pool = await createPool2()
    connection = await pool.getConnection()
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
    if (error.code === 'ORA-00001') {
      logger.error('descripción del error: ', error)
      return res.status(409)
        .json({ message: 'User o Celular ya están registrados Validar la información' })
    }
    logger.error('Ocurrió un error al crear el usuario: ', error)
    return res.status(500).json({ message: 'Ocurrió un error al crear el usuario, consulte con el admin' })
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        logger.error('Error al cerrar la conexión:', err)
      }
    }
  }
}
