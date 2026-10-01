import { peticion } from './cliente'

export interface Cuenta {
  id: number
  nombre: string
  archivada: boolean
  tipoCuentaId: number
  tipoCuenta: {
    id: number
    nombre: string
    comportamiento: 'NORMAL' | 'TARJETA_CREDITO' | 'DEUDA'
  }
  limiteCredito: string | null
  diaCorte: number | null
  diaPago: number | null
  tasaInteres: string | null
  tieneInteres: boolean | null
  montoOriginal: string | null
  cuentaPagoId: number | null
  saldo?: string
}

export interface CrearCuenta {
  nombre: string
  tipoCuentaId: number
  limiteCredito?: number
  diaCorte?: number
  diaPago?: number
  tasaInteres?: number
  tieneInteres?: boolean
  montoOriginal?: number
  cuentaPagoId?: number
}

export type ActualizarCuenta = Partial<CrearCuenta>

export interface SaldoCuenta {
  saldo: string
}

export async function listarCuentas(
  incluirArchivadas = false,
): Promise<Cuenta[]> {
  const parametro = incluirArchivadas ? '?incluirArchivadas=true' : ''

  return peticion<Cuenta[]>(`/cuentas${parametro}`)
}

export async function crearCuenta(
  datos: CrearCuenta,
): Promise<Cuenta> {
  return peticion<Cuenta>('/cuentas', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export async function obtenerSaldoCuenta(
  id: number,
): Promise<SaldoCuenta> {
  return peticion<SaldoCuenta>(`/cuentas/${id}/saldo`)
}

export async function actualizarCuenta(
  id: number,
  datos: ActualizarCuenta,
): Promise<Cuenta> {
  return peticion<Cuenta>(`/cuentas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export async function archivarCuenta(id: number): Promise<Cuenta> {
  return peticion<Cuenta>(`/cuentas/${id}/archivar`, {
    method: 'PATCH',
  })
}

export async function desarchivarCuenta(id: number): Promise<Cuenta> {
  return peticion<Cuenta>(`/cuentas/${id}/desarchivar`, {
    method: 'PATCH',
  })
}
