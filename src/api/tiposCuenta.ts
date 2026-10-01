import { peticion } from './cliente'

export type ComportamientoCuenta =
  | 'NORMAL'
  | 'TARJETA_CREDITO'
  | 'DEUDA'

export interface TipoCuenta {
  id: number
  nombre: string
  comportamiento: ComportamientoCuenta
  archivado: boolean
}

export interface CrearTipoCuenta {
  nombre: string
  comportamiento: ComportamientoCuenta
}

export type ActualizarTipoCuenta = Partial<CrearTipoCuenta>

export async function listarTiposCuenta(
  incluirArchivados = false,
): Promise<TipoCuenta[]> {
  const parametro = incluirArchivados
    ? '?incluirArchivados=true'
    : ''

  return peticion<TipoCuenta[]>(`/tipos-cuenta${parametro}`)
}

export async function crearTipoCuenta(
  datos: CrearTipoCuenta,
): Promise<TipoCuenta> {
  return peticion<TipoCuenta>('/tipos-cuenta', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export async function actualizarTipoCuenta(
  id: number,
  datos: ActualizarTipoCuenta,
): Promise<TipoCuenta> {
  return peticion<TipoCuenta>(`/tipos-cuenta/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export async function archivarTipoCuenta(
  id: number,
): Promise<TipoCuenta> {
  return peticion<TipoCuenta>(`/tipos-cuenta/${id}/archivar`, {
    method: 'PATCH',
  })
}

export async function desarchivarTipoCuenta(
  id: number,
): Promise<TipoCuenta> {
  return peticion<TipoCuenta>(`/tipos-cuenta/${id}/desarchivar`, {
    method: 'PATCH',
  })
}
