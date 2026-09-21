import { useState } from 'react'
import { Link } from 'react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarTransacciones } from '../api/transacciones'
import { listarCategorias } from '../api/categorias'
import { formatearDinero, formatearFecha } from '../utilidades/formato'

export default function Transacciones() {
  const [pagina, setPagina] = useState(1)

  const transacciones = useQuery({
    queryKey: ['transacciones', { pagina }],
    queryFn: () => listarTransacciones(pagina),
    placeholderData: keepPreviousData,
  })

  const categorias = useQuery({
    queryKey: ['categorias'],
    queryFn: () => listarCategorias(),
  })

  const nombres = new Map(
    (categorias.data ?? []).map((c) => [c.id, c.nombre] as const),
  )

  const resultado = transacciones.data

  return (
    <section>
      <h2>Transacciones</h2>
      <p>
        <Link to="/">← Volver al panel</Link>
      </p>
      {transacciones.isPending && <p>Cargando transacciones...</p>}
      {transacciones.error && (
        <p role="alert">{transacciones.error.message}</p>
      )}
      {resultado &&
        (resultado.datos.length === 0 ? (
          <p>Todavía no tienes transacciones.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Monto</th>
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
