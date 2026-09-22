import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  eliminarTransaccion,
  listarTransacciones,
  type FiltrosTransacciones,
} from '../api/transacciones'
import { listarCategorias } from '../api/categorias'
import { formatearDinero, formatearFecha } from '../utilidades/formato'

type Tipo = '' | 'INGRESO' | 'GASTO'

type Filtros = {
  tipo: Tipo
  categoriaId: string
  desde: string
  hasta: string
}

const FILTROS_VACIOS: Filtros = {
  tipo: '',
  categoriaId: '',
  desde: '',
  hasta: '',
}

export default function Transacciones() {
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(1)
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS)

  const filtrosApi: FiltrosTransacciones = {
    tipo: filtros.tipo || undefined,
    categoriaId: filtros.categoriaId ? Number(filtros.categoriaId) : undefined,
    desde: filtros.desde || undefined,
    hasta: filtros.hasta || undefined,
  }
  const hayFiltros = Object.values(filtros).some((valor) => valor !== '')

  const transacciones = useQuery({
    queryKey: ['transacciones', { pagina, ...filtrosApi }],
    queryFn: () => listarTransacciones(pagina, filtrosApi),
    placeholderData: keepPreviousData,
  })

  const categorias = useQuery({
    queryKey: ['categorias'],
    queryFn: () => listarCategorias(),
  })

  const eliminar = useMutation({
    mutationFn: eliminarTransaccion,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transacciones'] }),
        queryClient.invalidateQueries({ queryKey: ['balance'] }),
      ]),
  })

  const resultado = transacciones.data

  useEffect(() => {
    if (resultado && resultado.datos.length === 0 && pagina > 1) {
      setPagina(Math.max(1, resultado.totalPaginas))
    }
  }, [resultado, pagina])

  const listaCategorias = categorias.data ?? []
  const nombres = new Map(listaCategorias.map((c) => [c.id, c.nombre] as const))
  const categoriasVisibles = listaCategorias.filter(
    (c) => !filtros.tipo || c.tipo === filtros.tipo,
  )

  function cambiarFiltro(
    campo: 'categoriaId' | 'desde' | 'hasta',
    valor: string,
  ) {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }))
    setPagina(1)
  }

  function cambiarTipo(tipo: Tipo) {
    setFiltros((actuales) => ({ ...actuales, tipo, categoriaId: '' }))
    setPagina(1)
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_VACIOS)
    setPagina(1)
  }

  function confirmarEliminar(id: number) {
    if (
      window.confirm(
        '¿Eliminar esta transacción? Esta acción no se puede deshacer.',
      )
    ) {
      eliminar.mutate(id)
    }
  }

  return (
    <section>
            <h2>Transacciones</h2>
      <p>
        <Link to="/transacciones/nueva">Nueva transacción</Link>
      </p>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Tipo
          <select
            value={filtros.tipo}
            onChange={(e) => cambiarTipo(e.target.value as Tipo)}
          >
            <option value="">Todos</option>
            <option value="INGRESO">Ingresos</option>
            <option value="GASTO">Gastos</option>
          </select>
        </label>
        <label>
          Categoría
          <select
            value={filtros.categoriaId}
            onChange={(e) => cambiarFiltro('categoriaId', e.target.value)}
          >
            <option value="">Todas</option>
            {categoriasVisibles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Desde
          <input
            type="date"
            value={filtros.desde}
            max={filtros.hasta || undefined}
            onChange={(e) => cambiarFiltro('desde', e.target.value)}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={filtros.hasta}
            min={filtros.desde || undefined}
            onChange={(e) => cambiarFiltro('hasta', e.target.value)}
          />
        </label>
        <button type="button" onClick={limpiarFiltros} disabled={!hayFiltros}>
          Limpiar filtros
        </button>
      </form>

      {transacciones.isPending && <p>Cargando transacciones...</p>}
      {transacciones.error && (
        <p role="alert">{transacciones.error.message}</p>
      )}
      {eliminar.error && <p role="alert">{eliminar.error.message}</p>}
      {resultado &&
        (resultado.datos.length === 0 ? (
          <p>
            {hayFiltros
              ? 'No hay transacciones con esos filtros.'
              : 'Todavía no tienes transacciones.'}
          </p>
        ) : (
          <>
            <p>
              {resultado.total}{' '}
              {resultado.total === 1 ? 'resultado' : 'resultados'}
            </p>
            <table aria-busy={transacciones.isPlaceholderData}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {resultado.datos.map((t) => (
                  <tr key={t.id}>
                    <td>{formatearFecha(t.fecha)}</td>
                    <td>{t.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'}</td>
                    <td>{nombres.get(t.categoriaId) ?? '—'}</td>
                    <td>{t.descripcion ?? ''}</td>
                    <td>{formatearDinero(t.monto)}</td>
                    <td>
                      <Link to={`/transacciones/${t.id}/editar`}>Editar</Link>{' '}
                      <button
                        type="button"
                        onClick={() => confirmarEliminar(t.id)}
                        disabled={eliminar.isPending}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav aria-label="Paginación">
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina <= 1}
              >
                Anterior
              </button>
              <span>
                {' '}
                Página {resultado.pagina} de {resultado.totalPaginas}{' '}
              </span>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina >= resultado.totalPaginas}
              >
                Siguiente
              </button>
            </nav>
          </>
        ))}
    </section>
  )
}
