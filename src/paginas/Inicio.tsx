import { useEffect, useState } from 'react'
import { ErrorApi } from '../api/cliente'
import { obtenerBalance, type Balance } from '../api/balance'
import { formatearDinero } from '../utilidades/formato'

type Props = { alCerrarSesion: () => void }

export default function Inicio({ alCerrarSesion }: Props) {
  const [balance, setBalance] = useState<Balance | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    obtenerBalance()
      .then(setBalance)
      .catch((e: unknown) => {
        if (e instanceof ErrorApi && e.estado === 401) {
          alCerrarSesion()
          return
        }
        setError(e instanceof Error ? e.message : 'Error inesperado')
      })
  }, [alCerrarSesion])

  return (
    <section>
      <h2>Panel</h2>
      {error && <p role="alert">{error}</p>}
      {!error && !balance && <p>Cargando balance...</p>}
      {balance && (
        <dl>
          <dt>Ingresos</dt>
          <dd>{formatearDinero(balance.ingresos)}</dd>
          <dt>Gastos</dt>
          <dd>{formatearDinero(balance.gastos)}</dd>
          <dt>Balance</dt>
          <dd>{formatearDinero(balance.balance)}</dd>
        </dl>
      )}
      <button onClick={alCerrarSesion}>Cerrar sesión</button>
    </section>
  )
}
