import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { obtenerBalance } from '../api/balance'
import { formatearDinero } from '../utilidades/formato'

type Props = { alCerrarSesion: () => void }

export default function Inicio({ alCerrarSesion }: Props) {
  const {
    data: balance,
    error,
    isPending,
  } = useQuery({
    queryKey: ['balance'],
    queryFn: () => obtenerBalance(),
  })

  return (
    <section>
      <h2>Panel</h2>
      <nav>
        <Link to="/transacciones">Ver transacciones</Link>
      </nav>
      {isPending && <p>Cargando balance...</p>}
      {error && <p role="alert">{error.message}</p>}
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
