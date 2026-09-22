import { useState, type SyntheticEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  type Categoria,
} from '../api/categorias'

type Tipo = 'INGRESO' | 'GASTO'

export default function Categorias() {
  const queryClient = useQueryClient()

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<Tipo>('GASTO')
  const [enEdicion, setEnEdicion] = useState<Categoria | null>(null)
  const [nombreEdicion, setNombreEdicion] = useState('')

  const categorias = useQuery({
    queryKey: ['categorias'],
    queryFn: () => listarCategorias(),
  })

  function invalidarCategorias() {
    return queryClient.invalidateQueries({ queryKey: ['categorias'] })
  }

  const crear = useMutation({
    mutationFn: crearCategoria,
    onSuccess: async () => {
      await invalidarCategorias()
      setNombre('')
    },
  })

  const actualizar = useMutation({
    mutationFn: (datos: { id: number; nombre: string }) =>
      actualizarCategoria(datos.id, { nombre: datos.nombre }),
    onSuccess: async () => {
      await invalidarCategorias()
      setEnEdicion(null)
    },
  })

  const eliminar = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: invalidarCategorias,
  })

  function enviarNueva(evento: SyntheticEvent) {
    evento.preventDefault()
    crear.mutate({ nombre, tipo })
  }

  function empezarEdicion(categoria: Categoria) {
    setEnEdicion(categoria)
    setNombreEdicion(categoria.nombre)
  }

  function enviarEdicion(evento: SyntheticEvent) {
    evento.preventDefault()
    if (!enEdicion) return
    actualizar.mutate({ id: enEdicion.id, nombre: nombreEdicion })
  }

  function confirmarEliminar(categoria: Categoria) {
    if (window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
      eliminar.mutate(categoria.id)
    }
  }

  const ingresos = (categorias.data ?? []).filter((c) => c.tipo === 'INGRESO')
  const gastos = (categorias.data ?? []).filter((c) => c.tipo === 'GASTO')

  function fila(categoria: Categoria) {
    if (enEdicion?.id === categoria.id) {
      return (
        <li key={categoria.id}>
          <form onSubmit={enviarEdicion}>
            <input
              type="text"
              value={nombreEdicion}
              onChange={(e) => setNombreEdicion(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" disabled={actualizar.isPending}>
              {actualizar.isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setEnEdicion(null)}>
              Cancelar
            </button>
          </form>
          {actualizar.error && actualizar.variables?.id === categoria.id && (
            <p role="alert">{actualizar.error.message}</p>
          )}
        </li>
      )
    }

    return (
      <li key={categoria.id}>
        {categoria.nombre}{' '}
        <button type="button" onClick={() => empezarEdicion(categoria)}>
          Editar
        </button>{' '}
        <button
          type="button"
          onClick={() => confirmarEliminar(categoria)}
          disabled={eliminar.isPending}
        >
          Eliminar
        </button>
        {eliminar.error && eliminar.variables === categoria.id && (
          <p role="alert">{eliminar.error.message}</p>
        )}
      </li>
    )
  }

  return (
    <section>
      <h2>Categorías</h2>

      {categorias.isPending && <p>Cargando categorías...</p>}
      {categorias.error && <p role="alert">{categorias.error.message}</p>}

      {categorias.data && (
        <>
          <div>
            <h3>Ingresos</h3>
            {ingresos.length === 0 ? (
              <p>Todavía no tienes categorías de ingreso.</p>
            ) : (
              <ul>{ingresos.map(fila)}</ul>
            )}
          </div>
          <div>
            <h3>Gastos</h3>
            {gastos.length === 0 ? (
              <p>Todavía no tienes categorías de gasto.</p>
            ) : (
              <ul>{gastos.map(fila)}</ul>
            )}
          </div>
        </>
      )}

      <h3>Nueva categoría</h3>
      <form onSubmit={enviarNueva}>
        <label>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <label>
          Tipo
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as Tipo)}
          >
            <option value="GASTO">Gasto</option>
            <option value="INGRESO">Ingreso</option>
          </select>
        </label>
        {crear.error && <p role="alert">{crear.error.message}</p>}
        <button type="submit" disabled={crear.isPending}>
          {crear.isPending ? 'Creando...' : 'Crear categoría'}
        </button>
      </form>
    </section>
  )
}
