import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { obtenerBalance, type FiltrosBalance } from '../api/balance'
import { formatearDinero } from '../utilidades/formato'
import { hoy, primerDiaDelMes } from '../utilidades/fechas'
import '../estilos/inicio.css'

type Rango = { desde: string; hasta: string }

const SIN_RANGO: Rango = { desde: '', hasta: '' }

function IconoIngreso() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="6 11 12 5 18 11" />
    </svg>
  )
}

function IconoGasto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="18 13 12 19 6 13" />
    </svg>
  )
}

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
  const esteMesActivo =
    rango.desde === primerDiaDelMes() && rango.hasta === hoy()

  return (
    <section className="panel">
      <h2>Panel</h2>

      <form className="panel__filtros" onSubmit={(e) => e.preventDefault()}>
        <div className="panel__fechas">
          <label className="campo-fecha">
            Desde
            <input
              type="date"
              value={rango.desde}
              max={rango.hasta || undefined}
              onChange={(e) => cambiarRango('desde', e.target.value)}
            />
          </label>
          <label className="campo-fecha">
            Hasta
            <input
              type="date"
              value={rango.hasta}
              min={rango.desde || undefined}
              onChange={(e) => cambiarRango('hasta', e.target.value)}
            />
          </label>
        </div>
        <div className="panel__atajos">
                    <button
            type="button"
            className={esteMesActivo ? 'activo' : undefined}
            onClick={esteMes}
          >
            Este mes
          </button>
          <button type="button" onClick={verTodo} disabled={!hayRango}>
            Ver todo
          </button>
        </div>
      </form>

      {isPending && <p className="panel__estado">Cargando balance...</p>}
      {error && (
        <p className="panel__estado" role="alert">
          {error.message}
        </p>
      )}

      {balance && (
        <div className="tarjeta-balance">
          <p className="tarjeta-balance__periodo">
            {balance.desde ? formatearFechaCorta(balance.desde) : 'Sin inicio'}
            {' – '}
            {balance.hasta ? formatearFechaCorta(balance.hasta) : 'hoy'}
          </p>

          <p className="tarjeta-balance__etiqueta">Balance</p>
          <p className="tarjeta-balance__cifra numero">
            {formatearDinero(balance.balance)}
          </p>

          <dl className="tarjeta-balance__detalle">
            <div className="tarjeta-balance__item">
              <div className="tarjeta-balance__icono tarjeta-balance__icono--ingreso">
                <IconoIngreso />
              </div>
              <div>
                <dt>Ingresos</dt>
                <dd className="numero">{formatearDinero(balance.ingresos)}</dd>
              </div>
            </div>
            <div className="tarjeta-balance__item">
              <div className="tarjeta-balance__icono tarjeta-balance__icono--gasto">
                <IconoGasto />
              </div>
              <div>
                <dt>Gastos</dt>
                <dd className="numero">{formatearDinero(balance.gastos)}</dd>
              </div>
            </div>
          </dl>
        </div>
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
