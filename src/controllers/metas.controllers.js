import { pool } from '../connections/metas.js'

// TODO: Para hacer el login
async function BuscarUsuarioByUsername (username) {
  const [usuario] = await pool.execute('SELECT * FROM user WHERE username = ?', [username])
  return usuario
}
export const metasLogin = async (req, res) => {
  const { username, password } = req.body
  try {
    const [usuarioencontrado] = await BuscarUsuarioByUsername(username)

    // TODO: Si el usuario llega Validaremos la contraseña => password
    if (usuarioencontrado) {
      const valida = password === usuarioencontrado.password
      if (!valida) return res.status(401).json({ error: 'Contraseña No Valida' })
      res.status(200).json({
        user: {
          codigo: usuarioencontrado.codigo,
          usuario: usuarioencontrado.username,
          nombres: usuarioencontrado.nombres
        }
      })
    } else {
      res.status(404).json({ error: 'Usuario No Encontrado y/o No Existe' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

// TODO: Para traer la info del punto de venta
async function InfoPuntoDeVenta (codigo) {
  const [infoPuntoDeVenta] = await pool.execute(`select mt.zona, np.codigo , np.NOMBRE, np.SUPERVISOR,np.CATEGORIA,np.VERSION from GAMBLE.METASPRODUCTOS mt, GAMBLE.INFORMACION_PUNTOSVENTA np WHERE mt.SUCURSAL = ${codigo} and mt.FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;`)

  return infoPuntoDeVenta
}
export const infoPuntoDeVenta = async (req, res) => {
  const { codigo } = req.body
  try {
    const [infoPuntoDeVenta] = await InfoPuntoDeVenta(codigo)
    res.status(200).json(infoPuntoDeVenta)
  } catch (error) {
    console.error('Error al obtener la información del punto de venta:', error)
    res.status(500).json({ message: 'Hubo un problema al obtener la información del punto de venta. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Para traer las metas del día
async function BuscarMetasDelDia (codigo) {
  const [metas] = await pool.execute(
    `
    select 
      mt.CHANCE+mt.PAGAMAS+mt.PAGATODO+mt.GANE5+mt.PATA_MILLONARIA+mt.DOBLECHANCE+mt.CHANCE_MILLONARIO venta_actual,
      mt.PROMEDIO_DIARIO_CHANCE+mt.PROMEDIO_DIARIO_PAGAMAS+mt.PROMEDIO_DIARIO_PAGATODO+mt.PROMEDIO_DIARIO_PATAMI+mt.PROMEDIO_DIARIO_DOBLECHANCE+mt.PROMEDIO_DIARIO_CHMILL asp_dia
      from METASPRODUCTOS mt, INFORMACION_PUNTOSVENTA np WHERE mt.SUCURSAL = ${codigo} and mt.FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;
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
      select mt.sucursal, mt.CHANCE, mt.PROMEDIO_DIARIO_CHANCE, concat(round((mt.CHANCE)/(mt.PROMEDIO_DIARIO_CHANCE)*100,2),' %') PORCH, mt.PAGAMAS, mt.PROMEDIO_DIARIO_PAGAMAS, concat(round((mt.PAGAMAS)/(mt.PROMEDIO_DIARIO_PAGAMAS)*100,2),' %') PORPGM, mt.PAGATODO, mt.PROMEDIO_DIARIO_PAGATODO, concat(round((mt.PAGATODO)/(mt.PROMEDIO_DIARIO_PAGATODO)*100,2),' %') PORPGT, mt.GANE5, mt.PROMEDIO_DIARIO_GANE5, concat(round((mt.GANE5)/(mt.PROMEDIO_DIARIO_GANE5)*100,2),' %') PORGN5, mt.PATA_MILLONARIA, mt.PROMEDIO_DIARIO_PATAMI, concat(round((mt.PATA_MILLONARIA)/(mt.PROMEDIO_DIARIO_PATAMI)*100,2),' %') PORPTM, mt.DOBLECHANCE, mt.PROMEDIO_DIARIO_DOBLECHANCE, concat(round((mt.DOBLECHANCE)/(mt.PROMEDIO_DIARIO_DOBLECHANCE)*100,2),' %') PORDBCH, mt.CHANCE_MILLONARIO, mt.PROMEDIO_DIARIO_CHMILL, concat(round((mt.CHANCE_MILLONARIO)/(mt.PROMEDIO_DIARIO_CHMILL)*100,2),' %') PORCHM, mt.ASTRO, mt.PROMEDIO_DIARIO_ASTRO, concat(round((mt.ASTRO)/(mt.PROMEDIO_DIARIO_ASTRO)*100,2),' %') PORAST, mt.LOTERIA_FISICA, mt.PROMEDIO_DIARIO_LF, concat(round((mt.LOTERIA_FISICA)/(mt.PROMEDIO_DIARIO_LF)*100,2),' %') PORLTF, mt.LOTERIA_VIRTUAL, mt.PROMEDIO_DIARIO_LV, concat(round((mt.LOTERIA_VIRTUAL)/(mt.PROMEDIO_DIARIO_LV)*100,2),' %') PORLTV, mt.BETPLAY, mt.PROMEDIO_DIARIO_BETPLAY, concat(round((mt.BETPLAY)/(mt.PROMEDIO_DIARIO_BETPLAY)*100,2),' %') PORBTP, mt.GIROS, mt.PROMEDIO_DIARIO_GIROS, concat(round((mt.GIROS)/(mt.PROMEDIO_DIARIO_GIROS)*100,2),' %') PORSGR, mt.SOAT, mt.PROMEDIO_DIARIO_SOAT, concat(round((mt.SOAT)/(mt.PROMEDIO_DIARIO_SOAT)*100,2),' %') PORSOAT, mt.RECAUDOS, mt.PROMEDIO_DIARIO_RECAUDOS, concat(round((mt.RECAUDOS)/(mt.PROMEDIO_DIARIO_RECAUDOS)*100,2),' %') PORECAU, mt.RECARGAS, mt.PROMEDIO_DIARIO_RECARGAS, concat(round((mt.RECARGAS)/(mt.PROMEDIO_DIARIO_RECARGAS)*100,2),' %') PORECAR, mt.PROMO1, mt.META_PROMO1, mt.PROMO2, mt.META_PROMO2, concat(round((mt.PROMO2)/(mt.META_PROMO2)*100,2),' %') PORASPE
  from GAMBLE.METASPRODUCTOS mt, GAMBLE.INFORMACION_PUNTOSVENTA np WHERE mt.SUCURSAL = ${codigo} and mt.FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;
      `
  )
  return cumplimiento
}
async function CumplimientoDiaProductoJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mt.sucursal, mt.CHANCE, mt.PROMEDIO_DIARIO_CHANCE, concat(round((mt.CHANCE)/(mt.PROMEDIO_DIARIO_CHANCE)*100,2),' %') PORCH, mt.CHOLADITO, mt.PROMEDIO_DIARIO_CHOLADITO, concat(round((mt.CHOLADITO)/(mt.PROMEDIO_DIARIO_CHOLADITO)*100,2),' %') PORPGM, mt.PAGATODO_JAMUNDI, mt.PROMEDIO_DIARIO_PGTJAMUNDI, concat(round((mt.PAGATODO_JAMUNDI)/(mt.PROMEDIO_DIARIO_PGTJAMUNDI)*100,2),' %') PORPGT, mt.GANE5, mt.PROMEDIO_DIARIO_GANE5, concat(round((mt.GANE5)/(mt.PROMEDIO_DIARIO_GANE5)*100,2),' %') PORGN5, mt.PATA_MILLONARIA, mt.PROMEDIO_DIARIO_PATAMI, concat(round((mt.PATA_MILLONARIA)/(mt.PROMEDIO_DIARIO_PATAMI)*100,2),' %') PORPTM, mt.DOBLECHANCE, mt.PROMEDIO_DIARIO_DOBLECHANCE, concat(round((mt.DOBLECHANCE)/(mt.PROMEDIO_DIARIO_DOBLECHANCE)*100,2),' %') PORDBCH, mt.CHANCE_MILLONARIO, mt.PROMEDIO_DIARIO_CHMILL, concat(round((mt.CHANCE_MILLONARIO)/(mt.PROMEDIO_DIARIO_CHMILL)*100,2),' %') PORCHM, mt.ASTRO, mt.PROMEDIO_DIARIO_ASTRO, concat(round((mt.ASTRO)/(mt.PROMEDIO_DIARIO_ASTRO)*100,2),' %') PORAST, mt.LOTERIA_FISICA, mt.PROMEDIO_DIARIO_LF, concat(round((mt.LOTERIA_FISICA)/(mt.PROMEDIO_DIARIO_LF)*100,2),' %') PORLTF, mt.LOTERIA_VIRTUAL, mt.PROMEDIO_DIARIO_LV, concat(round((mt.LOTERIA_VIRTUAL)/(mt.PROMEDIO_DIARIO_LV)*100,2),' %') PORLTV, mt.BETPLAY, mt.PROMEDIO_DIARIO_BETPLAY, concat(round((mt.BETPLAY)/(mt.PROMEDIO_DIARIO_BETPLAY)*100,2),' %') PORBTP, mt.GIROS, mt.PROMEDIO_DIARIO_GIROS, concat(round((mt.GIROS)/(mt.PROMEDIO_DIARIO_GIROS)*100,2),' %') PORSGR, mt.SOAT, mt.PROMEDIO_DIARIO_SOAT, concat(round((mt.SOAT)/(mt.PROMEDIO_DIARIO_SOAT)*100,2),' %') PORSOAT, mt.RECAUDOS, mt.PROMEDIO_DIARIO_RECAUDOS, concat(round((mt.RECAUDOS)/(mt.PROMEDIO_DIARIO_RECAUDOS)*100,2),' %') PORECAU, mt.RECARGAS, mt.PROMEDIO_DIARIO_RECARGAS, concat(round((mt.RECARGAS)/(mt.PROMEDIO_DIARIO_RECARGAS)*100,2),' %') PORECAR, mt.PROMO1, mt.META_PROMO1, mt.PROMO2, mt.META_PROMO2, concat(round((mt.PROMO2)/(mt.META_PROMO2)*100,2),' %') PORASPE from GAMBLE.METASPRODUCTOS mt, GAMBLE.INFORMACION_PUNTOSVENTA np WHERE mt.SUCURSAL = ${codigo} and mt.FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;
    `
  )
  return cumplimiento
}

export const cumplimientoDiaProducto = async (req, res) => {
  const { codigo, zona } = req.body
  let cumplimiento
  try {
    if (zona === 39627) {
      [cumplimiento] = await CumplimientoDiaProductoYumbo(codigo)
      return res.status(200).json(cumplimiento)
    } else if (zona === 39628) {
      [cumplimiento] = await CumplimientoDiaProductoJamundi(codigo)
      return res.status(200).json(cumplimiento)
    } else {
      return res.status(400).json({ message: 'Zona no encontrada' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener el cumplimiento del día por producto. Por favor, inténtalo de nuevo más tarde.' })
  }
}

// TODO: Mes Actual Por Producto
async function CumMesActProdYumbo (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mt.sucursal, mt.EJE_CHANCE, mt.VTM_CHANCE, concat(round((mt.EJE_CHANCE)/(mt.VTM_CHANCE)*100,2),' %') PORCH, 
      mt.EJE_PAGAMAS, mt.VTM_PAGAMAS, concat(round((mt.EJE_PAGAMAS)/(mt.VTM_PAGAMAS)*100,2),' %') PORPGM, 
      mt.EJE_PAGATODO, mt.VTM_PAGATODO, concat(round((mt.EJE_PAGATODO)/(mt.VTM_PAGATODO)*100,2),' %') PORPGT, 
      mt.EJE_GANE5, mt.VTM_GANE5, concat(round((mt.EJE_GANE5)/(mt.VTM_GANE5)*100,2),' %') PORGN5, 
      mt.EJE_PATA_MILLONARIA, mt.VTM_PATA_MILLONARIA, concat(round((mt.EJE_PATA_MILLONARIA)/(mt.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM, 
      mt.EJE_DOBLECHANCE, mt.VTM_DOBLECHANCE, concat(round((mt.EJE_DOBLECHANCE)/(mt.VTM_DOBLECHANCE)*100,2),' %') PORDBCH, 
      mt.EJE_CHANCE_MILLONARIO, mt.VTM_CHANCE_MILLONARIO, concat(round((mt.EJE_CHANCE_MILLONARIO)/(mt.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mt.EJE_ASTRO, mt.VTM_ASTRO, concat(round((mt.EJE_ASTRO)/(mt.VTM_ASTRO)*100,2),' %') PORAST, 
      mt.EJE_LOTERIA_FISICA, mt.VTM_LOTERIA_FISICA, concat(round((mt.EJE_LOTERIA_FISICA)/(mt.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, 
      mt.EJE_LOTERIA_VIRTUAL, mt.VTM_LOTERIA_VIRTUAL, concat(round((mt.EJE_LOTERIA_VIRTUAL)/(mt.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mt.EJE_BETPLAY, mt.VTM_BETPLAY, concat(round((mt.EJE_BETPLAY)/(mt.VTM_BETPLAY)*100,2),' %') PORBTP, mt.EJE_GIROS, 
      mt.VTM_GIROS, concat(round((mt.EJE_GIROS)/(mt.VTM_GIROS)*100,2),' %') PORSGR, mt.EJE_SOAT, mt.VTM_SOAT, concat(round((mt.EJE_SOAT)/(mt.VTM_SOAT)*100,2),' %') PORSOAT,
      mt.EJE_RECAUDOS, mt.VTM_RECAUDOS, concat(round((mt.EJE_RECAUDOS)/(mt.VTM_RECAUDOS)*100,2),' %') PORECAU, mt.EJE_RECARGAS, 
      mt.VTM_RECARGAS, concat(round((mt.EJE_RECARGAS)/(mt.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1, mt.EJE_RASPE, 
      mt.VTM_RASPE, concat(round((mt.EJE_RASPE)/(mt.VTM_RASPE)*100,2),' %') PORASPE from GAMBLE.METAMES_ACUMULADO_MSR mt, GAMBLE.INFORMACION_PUNTOSVENTA np 
    WHERE mt.SUCURSAL = ${codigo} and mt.MES=MONTH (NOW()) and FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;
    `
  )

  return cumplimiento
}
async function CumMesActProdJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mt.sucursal, 
      mt.EJE_CHANCE, mt.VTM_CHANCE, concat(round((mt.EJE_CHANCE)/(mt.VTM_CHANCE)*100,2),' %') PORCH, 
      mt.EJE_CHOLADITO, mt.VTM_CHOLADITO, concat(round((mt.EJE_CHOLADITO)/(mt.VTM_CHOLADITO)*100,2),' %') PORCHO, mt.EJE_PAGATODO_JAMUNDI, 
      mt.VTM_PAGATODO_JAMUNDI, concat(round((mt.EJE_PAGATODO_JAMUNDI)/(mt.VTM_PAGATODO_JAMUNDI)*100,2),' %') PORPGT, mt.EJE_GANE5, 
      mt.VTM_GANE5, concat(round((mt.EJE_GANE5)/(mt.VTM_GANE5)*100,2),' %') PORGN5,
      mt.EJE_PATA_MILLONARIA, mt.VTM_PATA_MILLONARIA, concat(round((mt.EJE_PATA_MILLONARIA)/(mt.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM,
      mt.EJE_DOBLECHANCE, mt.VTM_DOBLECHANCE, concat(round((mt.EJE_DOBLECHANCE)/(mt.VTM_DOBLECHANCE)*100,2),' %') PORDBCH, 
      mt.EJE_CHANCE_MILLONARIO, mt.VTM_CHANCE_MILLONARIO, concat(round((mt.EJE_CHANCE_MILLONARIO)/(mt.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mt.EJE_ASTRO, mt.VTM_ASTRO, concat(round((mt.EJE_ASTRO)/(mt.VTM_ASTRO)*100,2),' %') PORAST, mt.EJE_LOTERIA_FISICA, 
      mt.VTM_LOTERIA_FISICA, concat(round((mt.EJE_LOTERIA_FISICA)/(mt.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, 
      mt.EJE_LOTERIA_VIRTUAL, mt.VTM_LOTERIA_VIRTUAL, concat(round((mt.EJE_LOTERIA_VIRTUAL)/(mt.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mt.EJE_BETPLAY, mt.VTM_BETPLAY, concat(round((mt.EJE_BETPLAY)/(mt.VTM_BETPLAY)*100,2),' %') PORBTP, 
      mt.EJE_GIROS, mt.VTM_GIROS, concat(round((mt.EJE_GIROS)/(mt.VTM_GIROS)*100,2),' %') PORSGR, 
      mt.EJE_SOAT, mt.VTM_SOAT, concat(round((mt.EJE_SOAT)/(mt.VTM_SOAT)*100,2),' %') PORSOAT, 
      mt.EJE_RECAUDOS, mt.VTM_RECAUDOS, concat(round((mt.EJE_RECAUDOS)/(mt.VTM_RECAUDOS)*100,2),' %') PORECAU, 
      mt.EJE_RECARGAS, mt.VTM_RECARGAS, concat(round((mt.EJE_RECARGAS)/(mt.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1, 
      mt.EJE_RASPE, mt.VTM_RASPE, concat(round((mt.EJE_RASPE)/(mt.VTM_RASPE)*100,2),' %') PORASPE from GAMBLE.METAMES_ACUMULADO_MSR 
      mt, GAMBLE.INFORMACION_PUNTOSVENTA np 
    WHERE mt.SUCURSAL = ${codigo} and mt.MES=MONTH (NOW()) and FECHA=CURDATE() and mt.SUCURSAL=np.CODIGO;
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
    select mt.sucursal, mt.EJE_CHANCE, 
      mt.VTM_CHANCE, concat(round((mt.EJE_CHANCE)/(mt.VTM_CHANCE)*100,2),' %') PORCH,
      mt.EJE_PAGAMAS, mt.VTM_PAGAMAS, concat(round((mt.EJE_PAGAMAS)/(mt.VTM_PAGAMAS)*100,2),' %') PORPGM,
      mt.EJE_PAGATODO, mt.VTM_PAGATODO, concat(round((mt.EJE_PAGATODO)/(mt.VTM_PAGATODO)*100,2),' %') PORPGT, mt.EJE_GANE5,
      mt.VTM_GANE5, concat(round((mt.EJE_GANE5)/(mt.VTM_GANE5)*100,2),' %') PORGN5, 
      mt.EJE_PATA_MILLONARIA, mt.VTM_PATA_MILLONARIA, concat(round((mt.EJE_PATA_MILLONARIA)/(mt.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM, mt.EJE_DOBLECHANCE,
      mt.VTM_DOBLECHANCE, concat(round((mt.EJE_DOBLECHANCE)/(mt.VTM_DOBLECHANCE)*100,2),' %') PORDBCH,
      mt.EJE_CHANCE_MILLONARIO, mt.VTM_CHANCE_MILLONARIO, concat(round((mt.EJE_CHANCE_MILLONARIO)/(mt.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM, 
      mt.EJE_ASTRO, mt.VTM_ASTRO, concat(round((mt.EJE_ASTRO)/(mt.VTM_ASTRO)*100,2),' %') PORAST, 
      mt.EJE_LOTERIA_FISICA, mt.VTM_LOTERIA_FISICA, concat(round((mt.EJE_LOTERIA_FISICA)/(mt.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF, mt.EJE_LOTERIA_VIRTUAL,
      mt.VTM_LOTERIA_VIRTUAL, concat(round((mt.EJE_LOTERIA_VIRTUAL)/(mt.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV, 
      mt.EJE_BETPLAY, mt.VTM_BETPLAY, concat(round((mt.EJE_BETPLAY)/(mt.VTM_BETPLAY)*100,2),' %') PORBTP, 
      mt.EJE_GIROS, mt.VTM_GIROS, concat(round((mt.EJE_GIROS)/(mt.VTM_GIROS)*100,2),' %') PORSGR, mt.EJE_SOAT, 
      mt.VTM_SOAT, concat(round((mt.EJE_SOAT)/(mt.VTM_SOAT)*100,2),' %') PORSOAT, mt.EJE_RECAUDOS, 
      mt.VTM_RECAUDOS, concat(round((mt.EJE_RECAUDOS)/(mt.VTM_RECAUDOS)*100,2),' %') PORECAU,
      mt.EJE_RECARGAS, mt.VTM_RECARGAS, concat(round((mt.EJE_RECARGAS)/(mt.VTM_RECARGAS)*100,2),' %') PORECAR, 0 PROMO1, 0 META_PROMO1,
      mt.EJE_RASPE, mt.VTM_RASPE, concat(round((mt.EJE_RASPE)/(mt.VTM_RASPE)*100,2),' %') PORASPE
    from GAMBLE.HIST_META_ACUMULADO mt, GAMBLE.INFORMACION_PUNTOSVENTA np 
    WHERE mt.SUCURSAL = ${codigo} and mt.MES=MONTH(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY),INTERVAL -2 MONTH)) and mt.SUCURSAL=np.codigo;
    `
  )

  return cumplimiento
}

async function CumMesAntProdJamundi (codigo) {
  const [cumplimiento] = await pool.execute(
    `
    select mt.sucursal, mt.EJE_CHANCE, mt.VTM_CHANCE, concat(round((mt.EJE_CHANCE)/(mt.VTM_CHANCE)*100,2),' %') PORCH, 
      mt.EJE_CHOLADITO, mt.VTM_CHOLADITO, concat(round((mt.EJE_CHOLADITO)/(mt.VTM_CHOLADITO)*100,2),' %') PORCHO, 
      mt.EJE_PAGATODO_JAMUNDI, mt.VTM_PAGATODO_JAMUNDI, concat(round((mt.EJE_PAGATODO_JAMUNDI)/(mt.VTM_PAGATODO_JAMUNDI)*100,2),' %') PORPGT,
      mt.EJE_GANE5, mt.VTM_GANE5, concat(round((mt.EJE_GANE5)/(mt.VTM_GANE5)*100,2),' %') PORGN5,
      mt.EJE_PATA_MILLONARIA, mt.VTM_PATA_MILLONARIA, concat(round((mt.EJE_PATA_MILLONARIA)/(mt.VTM_PATA_MILLONARIA)*100,2),' %') PORPTM,
      mt.EJE_DOBLECHANCE, mt.VTM_DOBLECHANCE, concat(round((mt.EJE_DOBLECHANCE)/(mt.VTM_DOBLECHANCE)*100,2),' %') PORDBCH,
      mt.EJE_CHANCE_MILLONARIO, mt.VTM_CHANCE_MILLONARIO, concat(round((mt.EJE_CHANCE_MILLONARIO)/(mt.VTM_CHANCE_MILLONARIO)*100,2),' %') PORCHM,
      mt.EJE_ASTRO, mt.VTM_ASTRO, concat(round((mt.EJE_ASTRO)/(mt.VTM_ASTRO)*100,2),' %') PORAST,
      mt.EJE_LOTERIA_FISICA, mt.VTM_LOTERIA_FISICA, concat(round((mt.EJE_LOTERIA_FISICA)/(mt.VTM_LOTERIA_FISICA)*100,2),' %') PORLTF,
      mt.EJE_LOTERIA_VIRTUAL, mt.VTM_LOTERIA_VIRTUAL, concat(round((mt.EJE_LOTERIA_VIRTUAL)/(mt.VTM_LOTERIA_VIRTUAL)*100,2),' %') PORLTV,
      mt.EJE_BETPLAY, mt.VTM_BETPLAY, concat(round((mt.EJE_BETPLAY)/(mt.VTM_BETPLAY)*100,2),' %') PORBTP,
      mt.EJE_GIROS, mt.VTM_GIROS, concat(round((mt.EJE_GIROS)/(mt.VTM_GIROS)*100,2),' %') PORSGR, 
      mt.EJE_SOAT,mt.VTM_SOAT, concat(round((mt.EJE_SOAT)/(mt.VTM_SOAT)*100,2),' %') PORSOAT,
      mt.EJE_RECAUDOS, mt.VTM_RECAUDOS, concat(round((mt.EJE_RECAUDOS)/(mt.VTM_RECAUDOS)*100,2),' %') PORECAU,
      mt.EJE_RECARGAS, mt.VTM_RECARGAS, concat(round((mt.EJE_RECARGAS)/(mt.VTM_RECARGAS)*100,2),' %') PORECAR,
      0 PROMO1, 0 META_PROMO1, mt.EJE_RASPE, mt.VTM_RASPE, concat(round((mt.EJE_RASPE)/(mt.VTM_RASPE)*100,2),' %') PORASPE
      from GAMBLE.HIST_META_ACUMULADO mt, GAMBLE.INFORMACION_PUNTOSVENTA np 
      WHERE mt.SUCURSAL = ${codigo} and mt.MES=MONTH(DATE_ADD(DATE_ADD(LAST_DAY(NOW()), INTERVAL 1 DAY),INTERVAL -2 MONTH)) and mt.SUCURSAL=np.codigo;
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
    SELECT FECHA, SUCURSAL, USUARIO, SUGERIDO1, (CUMPLIMIENTO+CUMPLIMIENTO2+CUMPLIMIENTO3+CUMPLIMIENTO4+CUMPLIMIENTO5+CUMPLIMIENTO6+CUMPLIMIENTO7+CUMPLIMIENTO8+CUMPLIMIENTO9) CANT_BOLETAS FROM CUMPLIMIENTO_SUGERIDOS_VEND where FECHA=CURDATE() AND SUCURSAL=${codigo} AND USUARIO='${user}';
    `
  )
  return results
}

export const ConsultarBoletasGanas = async (req, res) => {
  const { codigo, user } = req.body
  console.log(codigo, user)
  try {
    const [response] = await BoletasGanadas(codigo, user.usuario)
    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Hubo un problema al obtener las boletas ganadas. Por favor, inténtalo de nuevo más tarde.' })
  }
}
