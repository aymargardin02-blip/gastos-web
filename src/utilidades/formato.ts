const formatoDinero = new Intl.NumberFormat('es', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatearDinero(valor: string): string {
  return formatoDinero.format(Number(valor))
}
