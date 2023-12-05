export function Company ({ empresa }) {
  const companies = {
    0: 'Multired y Servired',
    1: 'Multired',
    2: 'Servired'
  }
  return companies[empresa]
}

export function Proceso ({ proceso }) {
  const procesos = {
    1: 'Técnología',
    2: 'Contabilidad',
    3: 'Comercial',
    4: 'Administración',
    5: 'Gestión Humana',
    6: 'Gerencia',
    7: 'Tesoreria',
    8: 'Auditoria',
    9: 'Cumplimiento'
  }
  return procesos[proceso]
}

export function State ({ estado }) {
  const states = {
    0: 'Inactivo',
    1: 'Activo'
  }
  return states[estado]
}
