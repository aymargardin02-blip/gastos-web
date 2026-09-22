function comoTexto(fecha: Date): string {
  return fecha.toLocaleDateString('en-CA')
}

export function primerDiaDelMes(): string {
  const ahora = new Date()
  return comoTexto(new Date(ahora.getFullYear(), ahora.getMonth(), 1))
}

export function hoy(): string {
  return comoTexto(new Date())
}
