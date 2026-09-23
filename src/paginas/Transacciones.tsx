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
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import '../estilos/transacciones.css'

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
  const [idAEliminar, setIdAEliminar] = useState<number | null>(null)

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

  function pedirConfirmacion(id: number) {
    setIdAEliminar(id)
  }

  function confirmarEliminar() {
    if (idAEliminar === null) return
    eliminar.mutate(idAEliminar, {
      onSuccess: () => setIdAEliminar(null),
    })
  }

  return (
    <section className="transacciones">
      <div className="transacciones__cabecera">
        <h2>Transacciones</h2>
        <Link className="boton-nueva" to="/transacciones/nueva">
          + Nueva transacción
        </Link>
      </div>

      <form
        className="transacciones__filtros"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="campo">
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
        <label className="campo">
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
        <label className="campo">
          Desde
          <input
            type="date"
            value={filtros.desde}
            max={filtros.hasta || undefined}
            onChange={(e) => cambiarFiltro('desde', e.target.value)}
          />
        </label>
        <label className="campo">
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

      {transacciones.isPending && (
        <p className="transacciones__estado">Cargando transacciones...</p>
      )}
      {transacciones.error && (
        <p className="transacciones__estado" role="alert">
          {transacciones.error.message}
        </p>
      )}
      {eliminar.error && (
        <p className="transacciones__estado" role="alert">
          {eliminar.error.message}
        </p>
      )}

      {resultado &&
        (resultado.datos.length === 0 ? (
          <p className="transacciones__estado">
            {hayFiltros
              ? 'No hay transacciones con esos filtros.'
              : 'Todavía no tienes transacciones.'}
          </p>
        ) : (
          <>
            <p className="transacciones__total">
              {resultado.total}{' '}
              {resultado.total === 1 ? 'resultado' : 'resultados'}
            </p>

            <div className="transacciones__tabla-envoltura">
              <table
                className="transacciones__tabla"
                aria-busy={transacciones.isPlaceholderData}
              >
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
                      <td data-etiqueta="Fecha">{formatearFecha(t.fecha)}</td>
                      <td data-etiqueta="Tipo">
                        <span
                          className={
                            t.tipo === 'INGRESO'
                              ? 'badge-tipo badge-tipo--ingreso'
                              : 'badge-tipo badge-tipo--gasto'
                          }
                        >
                          {t.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td data-etiqueta="Categoría">
                        {nombres.get(t.categoriaId) ?? '—'}
                      </td>
                      <td data-etiqueta="Descripción">
                        {t.descripcion ?? ''}
                      </td>
                      <td data-etiqueta="Monto" className="numero">
                        {formatearDinero(t.monto)}
                      </td>
                      <td data-etiqueta="Acciones">
                        <div className="transacciones__acciones-fila">
                          <Link to={`/transacciones/${t.id}/editar`}>
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => pedirConfirmacion(t.id)}
                            disabled={eliminar.isPending}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav
              className="transacciones__paginacion"
              aria-label="Paginación"
            >
              <button
                onClick={() => setPagina((p) => p - 1)}
                disabled={pagina <= 1}
              >
                Anterior
              </button>
              <span>
                Página {resultado.pagina} de {resultado.totalPaginas}
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

      <ModalConfirmacion
        abierto={idAEliminar !== null}
        titulo="Eliminar transacción"
        mensaje="¿Eliminar esta transacción? Esta acción no se puede deshacer."
        textoConfirmar="Eliminar"
        peligro
        cargando={eliminar.isPending}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setIdAEliminar(null)}
      />
    </section>
  )
}
