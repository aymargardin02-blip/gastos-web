import { useState, type SyntheticEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  type Categoria,
} from '../api/categorias'
import SelectorTipo, { type Tipo } from '../componentes/SelectorTipo'
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import '../estilos/categorias.css'

function IconoEditar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function IconoEliminar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
      <path d="M8 7v13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

export default function Categorias() {
  const queryClient = useQueryClient()

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<Tipo>('GASTO')
  const [enEdicion, setEnEdicion] = useState<Categoria | null>(null)
  const [nombreEdicion, setNombreEdicion] = useState('')
  const [aEliminar, setAEliminar] = useState<Categoria | null>(null)

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
    onSuccess: async () => {
      await invalidarCategorias()
      setAEliminar(null)
    },
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

  function confirmarEliminar() {
    if (!aEliminar) return
    eliminar.mutate(aEliminar.id)
  }

  const ingresos = (categorias.data ?? []).filter((c) => c.tipo === 'INGRESO')
  const gastos = (categorias.data ?? []).filter((c) => c.tipo === 'GASTO')

  function fila(categoria: Categoria) {
    if (enEdicion?.id === categoria.id) {
      return (
        <li key={categoria.id} className="categoria-fila categoria-fila--edicion">
          <form className="categoria-fila__form" onSubmit={enviarEdicion}>
            <input
              type="text"
              value={nombreEdicion}
              onChange={(e) => setNombreEdicion(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="principal" disabled={actualizar.isPending}>
              {actualizar.isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" onClick={() => setEnEdicion(null)}>
              Cancelar
            </button>
          </form>
          {actualizar.error && actualizar.variables?.id === categoria.id && (
            <p className="categorias__error" role="alert">
              {actualizar.error.message}
            </p>
          )}
        </li>
      )
    }

    return (
      <li key={categoria.id} className="categoria-fila">
        <span
          className={
            categoria.tipo === 'INGRESO'
              ? 'categoria-fila__punto categoria-fila__punto--ingreso'
              : 'categoria-fila__punto categoria-fila__punto--gasto'
          }
          aria-hidden="true"
        />
        <span className="categoria-fila__nombre">{categoria.nombre}</span>
        <div className="categoria-fila__acciones">
          <button
            type="button"
            className="boton-icono"
            onClick={() => empezarEdicion(categoria)}
            aria-label={`Editar ${categoria.nombre}`}
            title="Editar"
          >
            <IconoEditar />
          </button>
          <button
            type="button"
            className="boton-icono"
            onClick={() => setAEliminar(categoria)}
            disabled={eliminar.isPending}
            aria-label={`Eliminar ${categoria.nombre}`}
            title="Eliminar"
          >
            <IconoEliminar />
          </button>
        </div>
        {eliminar.error && aEliminar?.id === categoria.id && (
          <p className="categorias__error" role="alert">
            {eliminar.error.message}
          </p>
        )}
      </li>
    )
  }

  return (
    <section className="categorias">
      <h2>Categorías</h2>

      {categorias.isPending && (
        <p className="categorias__estado">Cargando categorías...</p>
      )}
      {categorias.error && (
        <p className="categorias__estado" role="alert">
          {categorias.error.message}
        </p>
      )}

      {categorias.data && (
        <>
          <div className="categorias__seccion">
            <h3>Ingresos</h3>
            {ingresos.length === 0 ? (
              <p className="categorias__estado">
                Todavía no tienes categorías de ingreso.
              </p>
            ) : (
              <ul className="categorias__lista">{ingresos.map(fila)}</ul>
            )}
          </div>
          <div className="categorias__seccion">
            <h3>Gastos</h3>
            {gastos.length === 0 ? (
              <p className="categorias__estado">
                Todavía no tienes categorías de gasto.
              </p>
            ) : (
              <ul className="categorias__lista">{gastos.map(fila)}</ul>
            )}
          </div>
        </>
      )}

      <div className="categorias__nueva">
        <h3>Nueva categoría</h3>
        <form className="categorias__form-nueva" onSubmit={enviarNueva}>
          <SelectorTipo
            valor={tipo}
            alCambiar={setTipo}
            etiquetaGrupo="Tipo de categoría"
          />
          <label className="campo">
            Nombre
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          {crear.error && (
            <p className="categorias__error" role="alert">
              {crear.error.message}
            </p>
          )}
          <button type="submit" className="principal" disabled={crear.isPending}>
            {crear.isPending ? 'Creando...' : 'Crear categoría'}
          </button>
        </form>
      </div>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar la categoría "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        peligro
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </section>
  )
}
