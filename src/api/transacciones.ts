import { peticion } from './cliente'

export type Transaccion = {
  id: number
  tipo: 'INGRESO' | 'GASTO'
  monto: string
  descripcion: string | null
  fecha: string
  categoriaId: number
  usuarioId: number
}

export type PaginaTransacciones = {
  datos: Transaccion[]
  total: number
  pagina: number
  limite: number
  totalPaginas: number
}

export type FiltrosTransacciones = {
  tipo?: 'INGRESO' | 'GASTO'
  categoriaId?: number
  desde?: string
  hasta?: string
}

export function listarTransacciones(
  pagina: number,
  filtros: FiltrosTransacciones = {},
  limite = 10,
) {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    limite: String(limite),
  })
  if (filtros.tipo) parametros.set('tipo', filtros.tipo)
  if (filtros.categoriaId)
    parametros.set('categoriaId', String(filtros.categoriaId))
  if (filtros.desde) parametros.set('desde', filtros.desde)
  if (filtros.hasta) parametros.set('hasta', filtros.hasta)

  return peticion<PaginaTransacciones>(
    `/transacciones?${parametros.toString()}`,
  )
}
