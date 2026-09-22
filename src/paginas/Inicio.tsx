import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerBalance, type FiltrosBalance } from '../api/balance'
import { formatearDinero } from '../utilidades/formato'
import { hoy, primerDiaDelMes } from '../utilidades/fechas'

type Rango = { desde: string; hasta: string }

const SIN_RANGO: Rango = { desde: '', hasta: '' }

export default function Inicio() {
  const [rango, setRango] = useState<Rango>(SIN_RANGO)

  const filtros: FiltrosBalance = {
    desde: rango.desde || undefined,
    hasta: rango.hasta || undefined,
  }

  const {
    data: balance,
    error,
    isPending,
  } = useQuery({
    queryKey: ['balance', filtros],
    queryFn: () => obtenerBalance(filtros),
  })

  function cambiarRango(campo: 'desde' | 'hasta', valor: string) {
    setRango((actual) => ({ ...actual, [campo]: valor }))
  }

  function esteMes() {
    setRango({ desde: primerDiaDelMes(), hasta: hoy() })
  }

  function verTodo() {
    setRango(SIN_RANGO)
  }

  const hayRango = rango.desde !== '' || rango.hasta !== ''

  return (
    <section>
      <h2>Panel</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Desde
          <input
            type="date"
            value={rango.desde}
            max={rango.hasta || undefined}
            onChange={(e) => cambiarRango('desde', e.target.value)}
          />
        </label>
        <label>
          Hasta
          <input
            type="date"
            value={rango.hasta}
            min={rango.desde || undefined}
            onChange={(e) => cambiarRango('hasta', e.target.value)}
          />
        </label>
        <button type="button" onClick={esteMes}>
          Este mes
        </button>
        <button type="button" onClick={verTodo} disabled={!hayRango}>
          Ver todo
        </button>
      </form>

      {isPending && <p>Cargando balance...</p>}
      {error && <p role="alert">{error.message}</p>}
      {balance && (
        <dl>
          <dt>Periodo</dt>
          <dd>
            {balance.desde ? formatearFechaCorta(balance.desde) : 'Sin inicio'}
            {' – '}
            {balance.hasta ? formatearFechaCorta(balance.hasta) : 'hoy'}
          </dd>
          <dt>Ingresos</dt>
          <dd>{formatearDinero(balance.ingresos)}</dd>
          <dt>Gastos</dt>
          <dd>{formatearDinero(balance.gastos)}</dd>
          <dt>Balance</dt>
          <dd>{formatearDinero(balance.balance)}</dd>
        </dl>
      )}
    </section>
  )
}

function formatearFechaCorta(valor: string): string {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(valor))
}
