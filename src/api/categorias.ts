import { peticion } from './cliente'

export type Categoria = {
  id: number
  nombre: string
  tipo: 'INGRESO' | 'GASTO'
  usuarioId: number
}

export function listarCategorias() {
  return peticion<Categoria[]>('/categorias')
}
