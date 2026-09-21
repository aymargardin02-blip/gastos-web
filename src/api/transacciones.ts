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

export function listarTransacciones(pagina: number, limite = 10) {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    limite: String(limite),
  })
  return peticion<PaginaTransacciones>(
    `/transacciones?${parametros.toString()}`,
  )
}
