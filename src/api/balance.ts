import { peticion } from './cliente'

export type Balance = {
  desde: string | null
  hasta: string | null
  ingresos: string
  gastos: string
  balance: string
}

export function obtenerBalance() {
  return peticion<Balance>('/balance')
}
