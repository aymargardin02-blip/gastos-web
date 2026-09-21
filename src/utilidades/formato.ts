const formatoDinero = new Intl.NumberFormat('es', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatearDinero(valor: string): string {
  return formatoDinero.format(Number(valor))
}

const formatoFecha = new Intl.DateTimeFormat('es', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

export function formatearFecha(valor: string): string {
  return formatoFecha.format(new Date(valor))
}
