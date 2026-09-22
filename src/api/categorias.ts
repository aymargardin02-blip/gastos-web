import { peticion } from './cliente'

export type Categoria = {
  id: number
  nombre: string
  tipo: 'INGRESO' | 'GASTO'
  usuarioId: number
}

export type NuevaCategoria = {
  nombre: string
  tipo: 'INGRESO' | 'GASTO'
}

export function listarCategorias() {
  return peticion<Categoria[]>('/categorias')
}

export function crearCategoria(datos: NuevaCategoria) {
  return peticion<Categoria>('/categorias', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarCategoria(id: number, datos: Partial<NuevaCategoria>) {
  return peticion<Categoria>(`/categorias/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function eliminarCategoria(id: number) {
  return peticion<Categoria>(`/categorias/${id}`, {
    method: 'DELETE',
  })
}
