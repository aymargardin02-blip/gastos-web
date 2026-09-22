import { peticion } from './cliente'

export type Balance = {
  desde: string | null
  hasta: string | null
  ingresos: string
  gastos: string
  balance: string
}

export type FiltrosBalance = {
  desde?: string
  hasta?: string
}

export function obtenerBalance(filtros: FiltrosBalance = {}) {
  const parametros = new URLSearchParams()
  if (filtros.desde) parametros.set('desde', filtros.desde)
  if (filtros.hasta) parametros.set('hasta', filtros.hasta)

  const query = parametros.toString()
  return peticion<Balance>(`/balance${query ? `?${query}` : ''}`)
}
