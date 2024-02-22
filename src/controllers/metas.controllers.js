import { pool } from '../connections/metas.js'

// TODO: Para hacer el login
async function BuscarUsuarioByUsername (username) {
  const [usuario] = await pool.execute('SELECT * FROM user WHERE username = ?', [username])
  return usuario
}
// TODO: Para traer la info del punto de venta
async function InfoPuntoDeVenta (codigo) {
  const [infoPuntoDeVenta] = await pool.execute(
    `select
      mp.zona, ip.codigo, ip.NOMBRE, ip.SUPERVISOR, ip.CATEGORIA, ip.VERSION 
    from 
      METASPRODUCTOS mp, 
      INFORMACION_PUNTOSVENTA ip 
    WHERE 
      mp.SUCURSAL = ${codigo} 
      and mp.FECHA=CURDATE() 
      and mp.SUCURSAL = ip.CODIGO;
      `
  )
  return infoPuntoDeVenta
}

export const metasLogin = async (req, res) => {
  const { username, password } = req.body
  try {
    const [usuarioencontrado] = await BuscarUsuarioByUsername(username)

    // TODO: Si el usuario llega Validaremos la contraseña => password
    if (usuarioencontrado) {
      const valida = password === usuarioencontrado.password
      if (!valida) return res.status(401).json({ error: 'Contraseña No Valida' })
      if (usuarioencontrado.estado !== 'A') {
        return res.status(401).json({ error: 'Usuario No Activo' })
      }

      const [datosPVD] = await InfoPuntoDeVenta(usuarioencontrado.codigo)

      delete usuarioencontrado.password
      delete datosPVD.codigo

      return res.status(200).json({ usuarioencontrado, datosPVD })
    } else {
      res.status(404).json({ error: 'Usuario No Encontrado y/o No Existe' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

// TODO: Para traer las metas del día
async function BuscarMetasDelDia (codigo) {
  const [metas] = await pool.execute(
    `
    select 
      mp.CHANCE+mp.PAGAMAS+mp.PAGATODO+mp.GANE5+mp.PATA_MILLONARIA+mp.DOBLECHANCE+mp.CHANCE_MILLONARIO venta_actual,
      mp.PROMEDIO_DIARIO_CHANCE+mp.PROMEDIO_DIARIO_PAGAMAS+mp.PROMEDIO_DIARIO_PAGATODO+mp.PROMEDIO_DIARIO_PATAMI+mp.PROMEDIO_DIARIO_DOBLECHANCE+mp.PROMEDIO_DIARIO_CHMILL asp_dia
      from METASPRODUCTOS mp, INFORMACION_PUNTOSVENTA ip WHERE mp.SUCURSAL = ${codigo} and mp.FECHA=CURDATE() and mp.SUCURSAL=ip.CODIGO;
    `
  )
  return metas
}
export const metasDelDia = async (req, res) => {
  const { codigo } = req.body
  try {
    const [metas] = await BuscarMetasDelDia(codigo)

    res.status(200).json(metas)
  } catch (error) {
    console.error('Error al obtener las metas del día:', error)
    res.status(500).json({ message: 'Hubo un problema al obtener las metas del día. Por favor, inténtalo de ResumenDia más tarde.' })
  }
}

// TODO: para traer el cumplimiento del día por producto
async function CumplimientoDiaProductoYumbo (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mp.CHANCE, mp.PROMEDIO_DIARIO_CHANCE, mp.PAGAMAS, mp.PROMEDIO_DIARIO_PAGAMAS, mp.PAGATODO, mp.PROMEDIO_DIARIO_PAGATODO,
      mp.GANE5, mp.PROMEDIO_DIARIO_GANE5, mp.PATA_MILLONARIA, mp.PROMEDIO_DIARIO_PATAMI, mp.DOBLECHANCE, mp.PROMEDIO_DIARIO_DOBLECHANCE,
      mp.CHANCE_MILLONARIO, mp.PROMEDIO_DIARIO_CHMILL, mp.ASTRO, mp.PROMEDIO_DIARIO_ASTRO, mp.LOTERIA_FISICA, mp.PROMEDIO_DIARIO_LF,
      mp.LOTERIA_VIRTUAL, mp.PROMEDIO_DIARIO_LV, mp.BETPLAY, mp.PROMEDIO_DIARIO_BETPLAY, mp.GIROS, mp.PROMEDIO_DIARIO_GIROS, mp.SOAT,
      mp.PROMEDIO_DIARIO_SOAT, mp.RECAUDOS, mp.PROMEDIO_DIARIO_RECAUDOS, mp.RECARGAS, mp.PROMEDIO_DIARIO_RECARGAS, mp.PROMO1, mp.META_PROMO1,
      mp.PROMO2, mp.META_PROMO2
    from 
      METASPRODUCTOS mp,
      INFORMACION_PUNTOSVENTA ip
    WHERE 
      mp.SUCURSAL = ${codigo} 
      and mp.FECHA = CURDATE() 
      and mp.SUCURSAL = ip.CODIGO;
    `
  )
  return cumplimiento
}
async function CumplimientoDiaProductoJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select
      mp.CHANCE, mp.PROMEDIO_DIARIO_CHANCE, mp.CHOLADITO, mp.PROMEDIO_DIARIO_CHOLADITO, mp.PAGATODO_JAMUNDI, mp.PROMEDIO_DIARIO_PGTJAMUNDI,
      mp.GANE5, mp.PROMEDIO_DIARIO_GANE5, mp.PATA_MILLONARIA, mp.PROMEDIO_DIARIO_PATAMI, mp.DOBLECHANCE, mp.PROMEDIO_DIARIO_DOBLECHANCE,
      mp.CHANCE_MILLONARIO, mp.PROMEDIO_DIARIO_CHMILL, mp.ASTRO, mp.PROMEDIO_DIARIO_ASTRO, mp.LOTERIA_FISICA, mp.PROMEDIO_DIARIO_LF,
      mp.LOTERIA_VIRTUAL, mp.PROMEDIO_DIARIO_LV, mp.BETPLAY, mp.PROMEDIO_DIARIO_BETPLAY, mp.GIROS, mp.PROMEDIO_DIARIO_GIROS, mp.SOAT,
      mp.PROMEDIO_DIARIO_SOAT, mp.RECAUDOS, mp.PROMEDIO_DIARIO_RECAUDOS, mp.RECARGAS, mp.PROMEDIO_DIARIO_RECARGAS, mp.PROMO1, mp.META_PROMO1,
      mp.PROMO2, mp.META_PROMO2
    from
      METASPRODUCTOS mp,
      INFORMACION_PUNTOSVENTA ip
    WHERE
      mp.SUCURSAL = ${codigo}
      and mp.FECHA = CURDATE()
      and mp.SUCURSAL = ip.CODIGO;
  `
  )
  return cumplimiento
}

export const cumplimientoDiaProducto = async (req, res) => {
  const { codigo, zona } = req.query
  let cumplimiento
  try {
    if (zona === '39627') {
      [cumplimiento] = await CumplimientoDiaProductoYumbo(codigo)
      return res.status(200).json(cumplimiento)
    } else if (zona === '39628') {
      [cumplimiento] = await CumplimientoDiaProductoJamundi(codigo)
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ error: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Hubo un problema al obtener el cumplimiento del día por producto. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Mes Actual Por Producto
async function CumMesActProdYumbo (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mp.sucursal, mp.EJE_CHANCE, mp.VTM_CHANCE, concat(round((mp.EJE_CHANCE)/(mp.VTM_CHANCE)*100,2),' %') PORCH, 
      mp.EJE_PAGAMAS, mp.VTM_PAGAMAS, concat(round((mp.EJE_PAGAMAS)/(mp.VTM_PAGAMAS)*100,2),' %') PORPGM, 
      mp.EJE_PAGATODO, mp.VTM_PAGATODO, concat(round((mp.EJE_PAGATODO)/(mp.VTM_PAGATODO)*100,2),' %') PORPGT, 
      mp.EJE_GANE5, mp.VTM_GANE5, concat(round((mp.EJE_GANE5)/(mp.VTM_GANE5)*100,2),' %') PORGN5, 
      mp.EJE_PATA_MILLONARIA, mp.VTM_PATA_MILLONARIA, concat(round((mp.EJE_PATA_MILLONARIA)/(mp.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM, 
      mp.EJE_DOBLECHANCE, mp.VTM_DOBLECHANCE, concat(round((mp.EJE_DOBLECHANCE)/(mp.VTM_DOBLECHANCE)*100,2),' %') PORDBCH, 
      mp.EJE_CHANCE_MILLONARIO, mp.VTM_CHANCE_MILLONARIO, concat(round((mp.EJE_CHANCE_MILLONARIO)/(mp.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mp.EJE_ASTRO, mp.VTM_ASTRO, concat(round((mp.EJE_ASTRO)/(mp.VTM_ASTRO)*100,2),' %') PORAST, 
      mp.EJE_LOTERIA_FISICA, mp.VTM_LOTERIA_FISICA, concat(round((mp.EJE_LOTERIA_FISICA)/(mp.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, 
      mp.EJE_LOTERIA_VIRTUAL, mp.VTM_LOTERIA_VIRTUAL, concat(round((mp.EJE_LOTERIA_VIRTUAL)/(mp.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mp.EJE_BETPLAY, mp.VTM_BETPLAY, concat(round((mp.EJE_BETPLAY)/(mp.VTM_BETPLAY)*100,2),' %') PORBTP, mp.EJE_GIROS, 
      mp.VTM_GIROS, concat(round((mp.EJE_GIROS)/(mp.VTM_GIROS)*100,2),' %') PORSGR, mp.EJE_SOAT, mp.VTM_SOAT, concat(round((mp.EJE_SOAT)/(mp.VTM_SOAT)*100,2),' %') PORSOAT,
      mp.EJE_RECAUDOS, mp.VTM_RECAUDOS, concat(round((mp.EJE_RECAUDOS)/(mp.VTM_RECAUDOS)*100,2),' %') PORECAU, mp.EJE_RECARGAS, 
      mp.VTM_RECARGAS, concat(round((mp.EJE_RECARGAS)/(mp.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1, mp.EJE_RASPE, 
      mp.VTM_RASPE, concat(round((mp.EJE_RASPE)/(mp.VTM_RASPE)*100,2),' %') PORASPE from GAMBLE.METAMES_ACUMULADO_MSR mp, GAMBLE.INFORMACION_PUNTOSVENTA ip 
    WHERE mp.SUCURSAL = ${codigo} and mp.MES=MONTH (NOW()) and FECHA=CURDATE() and mp.SUCURSAL=ip.CODIGO;
    `
  )

  return cumplimiento
}
async function CumMesActProdJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mp.sucursal, 
      mp.EJE_CHANCE, mp.VTM_CHANCE, concat(round((mp.EJE_CHANCE)/(mp.VTM_CHANCE)*100,2),' %') PORCH, 
      mp.EJE_CHOLADITO, mp.VTM_CHOLADITO, concat(round((mp.EJE_CHOLADITO)/(mp.VTM_CHOLADITO)*100,2),' %') PORCHO, mp.EJE_PAGATODO_JAMUNDI, 
      mp.VTM_PAGATODO_JAMUNDI, concat(round((mp.EJE_PAGATODO_JAMUNDI)/(mp.VTM_PAGATODO_JAMUNDI)*100,2),' %') PORPGT, mp.EJE_GANE5, 
      mp.VTM_GANE5, concat(round((mp.EJE_GANE5)/(mp.VTM_GANE5)*100,2),' %') PORGN5,
      mp.EJE_PATA_MILLONARIA, mp.VTM_PATA_MILLONARIA, concat(round((mp.EJE_PATA_MILLONARIA)/(mp.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM,
      mp.EJE_DOBLECHANCE, mp.VTM_DOBLECHANCE, concat(round((mp.EJE_DOBLECHANCE)/(mp.VTM_DOBLECHANCE)*100,2),' %') PORDBCH, 
      mp.EJE_CHANCE_MILLONARIO, mp.VTM_CHANCE_MILLONARIO, concat(round((mp.EJE_CHANCE_MILLONARIO)/(mp.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mp.EJE_ASTRO, mp.VTM_ASTRO, concat(round((mp.EJE_ASTRO)/(mp.VTM_ASTRO)*100,2),' %') PORAST, mp.EJE_LOTERIA_FISICA, 
      mp.VTM_LOTERIA_FISICA, concat(round((mp.EJE_LOTERIA_FISICA)/(mp.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, 
      mp.EJE_LOTERIA_VIRTUAL, mp.VTM_LOTERIA_VIRTUAL, concat(round((mp.EJE_LOTERIA_VIRTUAL)/(mp.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mp.EJE_BETPLAY, mp.VTM_BETPLAY, concat(round((mp.EJE_BETPLAY)/(mp.VTM_BETPLAY)*100,2),' %') PORBTP, 
      mp.EJE_GIROS, mp.VTM_GIROS, concat(round((mp.EJE_GIROS)/(mp.VTM_GIROS)*100,2),' %') PORSGR, 
      mp.EJE_SOAT, mp.VTM_SOAT, concat(round((mp.EJE_SOAT)/(mp.VTM_SOAT)*100,2),' %') PORSOAT, 
      mp.EJE_RECAUDOS, mp.VTM_RECAUDOS, concat(round((mp.EJE_RECAUDOS)/(mp.VTM_RECAUDOS)*100,2),' %') PORECAU, 
      mp.EJE_RECARGAS, mp.VTM_RECARGAS, concat(round((mp.EJE_RECARGAS)/(mp.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1, 
      mp.EJE_RASPE, mp.VTM_RASPE, concat(round((mp.EJE_RASPE)/(mp.VTM_RASPE)*100,2),' %') PORASPE from GAMBLE.METAMES_ACUMULADO_MSR 
      mp, GAMBLE.INFORMACION_PUNTOSVENTA ip 
    WHERE mp.SUCURSAL = ${codigo} and mp.MES=MONTH (NOW()) and FECHA=CURDATE() and mp.SUCURSAL=ip.CODIGO;
    `
  )

  return cumplimiento
}

export const CumplimientoMesActualProducto = async (req, res) => {
  const { codigo, zona } = req.body
  let cumplimiento
  try {
    if (zona === 39627) {
      [cumplimiento] = await CumMesActProdYumbo(codigo)
      return res.status(200).json(cumplimiento)
    } else if (zona === 39628) {
      [cumplimiento] = await CumMesActProdJamundi(codigo)
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ message: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener el cumplimiento del mes actual por producto. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Mes Anterior Por Producto
async function CumMesAntProdYumbo (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mp.sucursal, mp.EJE_CHANCE, 
      mp.VTM_CHANCE, concat(round((mp.EJE_CHANCE)/(mp.VTM_CHANCE)*100,2),' %') PORCH,
      mp.EJE_PAGAMAS, mp.VTM_PAGAMAS, concat(round((mp.EJE_PAGAMAS)/(mp.VTM_PAGAMAS)*100,2),' %') PORPGM,
      mp.EJE_PAGATODO, mp.VTM_PAGATODO, concat(round((mp.EJE_PAGATODO)/(mp.VTM_PAGATODO)*100,2),' %') PORPGT, mp.EJE_GANE5,
      mp.VTM_GANE5, concat(round((mp.EJE_GANE5)/(mp.VTM_GANE5)*100,2),' %') PORGN5, 
      mp.EJE_PATA_MILLONARIA, mp.VTM_PATA_MILLONARIA, concat(round((mp.EJE_PATA_MILLONARIA)/(mp.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM, mp.EJE_DOBLECHANCE,
      mp.VTM_DOBLECHANCE, concat(round((mp.EJE_DOBLECHANCE)/(mp.VTM_DOBLECHANCE)*100,2),' %') PORDBCH,
      mp.EJE_CHANCE_MILLONARIO, mp.VTM_CHANCE_MILLONARIO, concat(round((mp.EJE_CHANCE_MILLONARIO)/(mp.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mp.EJE_ASTRO, mp.VTM_ASTRO, concat(round((mp.EJE_ASTRO)/(mp.VTM_ASTRO)*100,2),' %') PORAST, 
      mp.EJE_LOTERIA_FISICA, mp.VTM_LOTERIA_FISICA, concat(round((mp.EJE_LOTERIA_FISICA)/(mp.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, mp.EJE_LOTERIA_VIRTUAL,
      mp.VTM_LOTERIA_VIRTUAL, concat(round((mp.EJE_LOTERIA_VIRTUAL)/(mp.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mp.EJE_BETPLAY, mp.VTM_BETPLAY, concat(round((mp.EJE_BETPLAY)/(mp.VTM_BETPLAY)*100,2),' %') PORBTP, 
      mp.EJE_GIROS, mp.VTM_GIROS, concat(round((mp.EJE_GIROS)/(mp.VTM_GIROS)*100,2),' %') PORSGR, mp.EJE_SOAT, 
      mp.VTM_SOAT, concat(round((mp.EJE_SOAT)/(mp.VTM_SOAT)*100,2),' %') PORSOAT, mp.EJE_RECAUDOS, 
      mp.VTM_RECAUDOS, concat(round((mp.EJE_RECAUDOS)/(mp.VTM_RECAUDOS)*100,2),' %') PORECAU,
      mp.EJE_RECARGAS, mp.VTM_RECARGAS, concat(round((mp.EJE_RECARGAS)/(mp.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1,
      mp.EJE_RASPE, mp.VTM_RASPE, concat(round((mp.EJE_RASPE)/(mp.VTM_RASPE)*100,2),' %') PORASPE
    from GAMBLE.HIST_META_ACUMULADO mp, GAMBLE.INFORMACION_PUNTOSVENTA ip 
    WHERE mp.SUCURSAL = ${codigo} and mp.MES=MONTH(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY),INTERVAL -2 MONTH)) and mp.SUCURSAL=ip.codigo;
    `
  )

  return cumplimiento
}

async function CumMesAntProdJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mp.sucursal, mp.EJE_CHANCE, mp.VTM_CHANCE, concat(round((mp.EJE_CHANCE)/(mp.VTM_CHANCE)*100,2),' %') PORCH, 
      mp.EJE_CHOLADITO, mp.VTM_CHOLADITO, concat(round((mp.EJE_CHOLADITO)/(mp.VTM_CHOLADITO)*100,2),' %') PORCHO, 
      mp.EJE_PAGATODO_JAMUNDI, mp.VTM_PAGATODO_JAMUNDI, concat(round((mp.EJE_PAGATODO_JAMUNDI)/(mp.VTM_PAGATODO_JAMUNDI)*100,2),' %') PORPGT,
      mp.EJE_GANE5, mp.VTM_GANE5, concat(round((mp.EJE_GANE5)/(mp.VTM_GANE5)*100,2),' %') PORGN5,
      mp.EJE_PATA_MILLONARIA, mp.VTM_PATA_MILLONARIA, concat(round((mp.EJE_PATA_MILLONARIA)/(mp.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM,
      mp.EJE_DOBLECHANCE, mp.VTM_DOBLECHANCE, concat(round((mp.EJE_DOBLECHANCE)/(mp.VTM_DOBLECHANCE)*100,2),' %') PORDBCH,
      mp.EJE_CHANCE_MILLONARIO, mp.VTM_CHANCE_MILLONARIO, concat(round((mp.EJE_CHANCE_MILLONARIO)/(mp.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM,
      mp.EJE_ASTRO, mp.VTM_ASTRO, concat(round((mp.EJE_ASTRO)/(mp.VTM_ASTRO)*100,2),' %') PORAST,
      mp.EJE_LOTERIA_FISICA, mp.VTM_LOTERIA_FISICA, concat(round((mp.EJE_LOTERIA_FISICA)/(mp.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF,
      mp.EJE_LOTERIA_VIRTUAL, mp.VTM_LOTERIA_VIRTUAL, concat(round((mp.EJE_LOTERIA_VIRTUAL)/(mp.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV,
      mp.EJE_BETPLAY, mp.VTM_BETPLAY, concat(round((mp.EJE_BETPLAY)/(mp.VTM_BETPLAY)*100,2),' %') PORBTP,
      mp.EJE_GIROS, mp.VTM_GIROS, concat(round((mp.EJE_GIROS)/(mp.VTM_GIROS)*100,2),' %') PORSGR, 
      mp.EJE_SOAT,mp.VTM_SOAT, concat(round((mp.EJE_SOAT)/(mp.VTM_SOAT)*100,2),' %') PORSOAT,
      mp.EJE_RECAUDOS, mp.VTM_RECAUDOS, concat(round((mp.EJE_RECAUDOS)/(mp.VTM_RECAUDOS)*100,2),' %') PORECAU,
      mp.EJE_RECARGAS, mp.VTM_RECARGAS, concat(round((mp.EJE_RECARGAS)/(mp.VTM_RECARGAS)*100,2),' %') PORECAR,
      0 PROMO1, 0 META_PROMO1, mp.EJE_RASPE, mp.VTM_RASPE, concat(round((mp.EJE_RASPE)/(mp.VTM_RASPE)*100,2),' %') PORASPE
      from GAMBLE.HIST_META_ACUMULADO mp, GAMBLE.INFORMACION_PUNTOSVENTA ip 
      WHERE mp.SUCURSAL = ${codigo} and mp.MES=MONTH(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY),INTERVAL -2 MONTH)) and mp.SUCURSAL=ip.codigo;
    `
  )
  return cumplimiento
}

export const cumplimientoMesAnteriorProducto = async (req, res) => {
  const { codigo, zona } = req.body
  let cumplimiento
  try {
    if (zona === 39627) {
      [cumplimiento] = await CumMesAntProdYumbo(codigo)
      return res.status(200).json(cumplimiento)
    } else if (zona === 39628) {
      [cumplimiento] = await CumMesAntProdJamundi(codigo)
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ message: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener el cumplimiento del mes anterior por producto. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Sugeridos Primera Consulta
async function SugeridosProdYumbo (codigo, user) {
  const [cumplimiento] = await pool.execute(
    `
      SELECT FECHA, SUCURSAL, USUARIO, SUGERIDO1, (VTA_CHANCE + VTA_PAGAMAS + VTA_PAGATODO + VTA_GANE5 + VTA_PATA_MILLONARIA + VTA_DOBLECHANCE + VTA_CHANCE_MILLONARIO) VTA_SUGERIDO, META_SUG1 META_SUGERIDO1 
      FROM SUGERIDOS_VENDEDOR 
      WHERE FECHA=CURDATE() 
      AND SUCURSAL= ${codigo} 
      AND USUARIO='${user}';
    `
  )

  return cumplimiento
}

async function SugeridosProdJamundi (codigo, user) {
  const [cumplimiento] = await pool.execute(
    `
    SELECT FECHA, SUCURSAL, USUARIO, SUGERIDO1, (VTA_CHANCE + VTA_CHOLADITO + VTA_PAGATODO_JAMUNDI + VTA_GANE5 + VTA_PATA_MILLONARIA + VTA_DOBLECHANCE + VTA_CHANCE_MILLONARIO) VTA_SUGERIDO, META_SUG1 META_SUGERIDO1 
    FROM SUGERIDOS_VENDEDOR 
    WHERE FECHA=CURDATE() 
    AND SUCURSAL= ${codigo} 
    AND USUARIO='${user}';
    `
  )

  return cumplimiento
}

export const SugeridosPrimeraConsulta = async (req, res) => {
  const { codigo, zona, user } = req.body
  let cumplimiento
  try {
    if (zona === 39627) {
      [cumplimiento] = await SugeridosProdYumbo(codigo, user)

      if (cumplimiento === undefined) {
        return res.status(404).json({ message: `No Se Generado Sugeridos, Para El Usuario ${user.slice(2)} Por El Momento, Validar En 5 min` })
      }
      return res.status(200).json(cumplimiento)
    } else if (zona === 39628) {
      [cumplimiento] = await SugeridosProdJamundi(codigo, user)
      if (cumplimiento === undefined) {
        return res.status(404).json({ message: `No Se Generado Sugeridos, Para El Usuario ${user.slice(2)} Por El Momento, Validar En 5 min` })
      }
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ message: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener los sugeridos de la primera consulta. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Sugeridos Segunda Consulta

async function SugeridosProdYumbo2 (codigo, user) {
  const [cumplimiento] = await pool.execute(
    `
    SELECT FECHA, SUCURSAL, SUGERIDO1 as SUGERIDO2, (VTA_CHANCE + VTA_PAGAMAS + VTA_PAGATODO + VTA_GANE5 + VTA_PATA_MILLONARIA + VTA_DOBLECHANCE + VTA_CHANCE_MILLONARIO) VTA_SUGERIDO, META_SUG1*2 META_SUGERIDO1 
    FROM SUGERIDOS_VENDEDOR 
    WHERE FECHA=CURDATE() AND concat(USUARIO, SUCURSAL) IN (SELECT DISTINCT concat(USUARIO, SUCURSAL) 
    FROM CUMPLIMIENTO_SUGERIDOS_VEND 
    where FECHA=CURDATE()) AND SUCURSAL=${codigo} AND USUARIO='${user}';
    `
  )

  return cumplimiento
}

async function SugeridosProdJamundi2 (codigo, user) {
  const [cumplimiento] = await pool.execute(
    `
    SELECT FECHA, SUCURSAL, SUGERIDO1 as SUGERIDO2, (VTA_CHANCE + VTA_PAGAMAS + VTA_PAGATODO + VTA_GANE5 + VTA_PATA_MILLONARIA + VTA_DOBLECHANCE + VTA_CHANCE_MILLONARIO) VTA_SUGERIDO, META_SUG1*2 META_SUGERIDO1 
    FROM SUGERIDOS_VENDEDOR 
    WHERE FECHA=CURDATE() AND concat(USUARIO, SUCURSAL) IN (SELECT DISTINCT concat(USUARIO, SUCURSAL) 
    FROM CUMPLIMIENTO_SUGERIDOS_VEND 
    where FECHA=CURDATE()) AND SUCURSAL=${codigo} AND USUARIO=${user};
    `
  )

  return cumplimiento
}

export const SugeridosSegundaConsulta = async (req, res) => {
  const { codigo, zona, user } = req.body

  let cumplimiento
  try {
    if (zona === 39627) {
      [cumplimiento] = await SugeridosProdYumbo2(codigo, user)

      if (cumplimiento === undefined) {
        return res.status(404).json({ message: `No Se Generado Sugeridos, Para El Usuario ${user.slice(2)} Por El Momento, Validar En 5 min` })
      }
      return res.status(200).json(cumplimiento)
    } else if (zona === 39628) {
      [cumplimiento] = await SugeridosProdJamundi2(codigo, user)
      if (cumplimiento === undefined) {
        return res.status(404).json({ message: `No Se Generado Sugeridos, Para El Usuario ${user.slice(2)} Por El Momento, Validar En 5 min` })
      }
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ message: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener los sugeridos de la primera consulta. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Consultar Boletas Ganadas
async function BoletasGanadas (codigo, user) {
  const [results] = await pool.execute(
    `
    SELECT FECHA, SUCURSAL, USUARIO, SUGERIDO1, 
    (CUMPLIMIENTO+CUMPLIMIENTO2+CUMPLIMIENTO3+CUMPLIMIENTO4+CUMPLIMIENTO5+CUMPLIMIENTO6+CUMPLIMIENTO7+CUMPLIMIENTO8+CUMPLIMIENTO9) CANT_BOLETAS
    FROM CUMPLIMIENTO_SUGERIDOS_VEND where FECHA=CURDATE() AND SUCURSAL=${codigo} AND USUARIO='${user}';
    `
  )
  return results
}

export const ConsultarBoletasGanas = async (req, res) => {
  const { codigo, user } = req.body

  try {
    const [results] = await BoletasGanadas(codigo, user)
    return res.status(200).json(results)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener las boletas ganadas. Por favor, inténtalo de nuevo más tarde.' })
  }
}
