import { Router } from 'express'
import { metasLogin, metasDelDia, cumplimientoDiaProducto, infoPuntoDeVenta, cumplimientoMesAnteriorProducto, CumplimientoMesActualProducto, SugeridosPrimeraConsulta, ConsultarBoletasGanas, SugeridosSegundaConsulta } from '../controllers/metas.controllers.js'

export const RutasMetas = Router()

RutasMetas.post('/metasLogin', metasLogin)

RutasMetas.post('/metasDelDiaSucursal', metasDelDia)

RutasMetas.get('/metarDiaxProducto', cumplimientoDiaProducto)

RutasMetas.post('/infoPuntoDeVenta', infoPuntoDeVenta)

RutasMetas.post('/cumplimientoMesAnteriorProducto', cumplimientoMesAnteriorProducto)

RutasMetas.post('/CumplimientoMesActualProducto', CumplimientoMesActualProducto)

RutasMetas.post('/SugeridosPrimeraConsulta', SugeridosPrimeraConsulta)

RutasMetas.post('/consultarBoletasGanas', ConsultarBoletasGanas)

RutasMetas.post('/SugeridosSegundaConsulta', SugeridosSegundaConsulta)
