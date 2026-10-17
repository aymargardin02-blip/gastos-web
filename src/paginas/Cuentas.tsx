
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  archivarCuenta,
  desarchivarCuenta,
  listarCuentas,
  type Cuenta,
} from '../api/cuentas'
import FormularioCuenta from '../componentes/FormularioCuenta'
import '../estilos/cuentas.css'

function IconoCartera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M3 9h18M16 14h2" />
    </svg>
  )
}

function IconoEfectivo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 9.5v0M18 14.5v0" />
    </svg>
  )
}

function IconoBanco() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9h18L12 4 3 9Z" />
      <path d="M5 10v7M9 10v7M15 10v7M19 10v7" />
      <path d="M3 19h18" />
    </svg>
  )
}

function IconoAhorro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 10.5A7 7 0 0 1 18.5 9l1.5 1.5v6h-3" />
      <path d="M4 11v5a4 4 0 0 0 4 4h7a4 4 0 0 0 4-4" />
      <path d="M8 8V6h3l1.5 2" />
      <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoInversion() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19V5M4 19h16" />
      <path d="m7 15 4-4 3 2 5-7M15 6h4v4" />
    </svg>
  )
}

function IconoTarjeta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  )
}

function IconoDeuda() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </svg>
  )
}

function IconoCuenta({
  nombre,
  comportamiento,
}: {
  nombre: string
  comportamiento: 'NORMAL' | 'TARJETA_CREDITO' | 'DEUDA'
}) {
  const nombreNormalizado = nombre.toLowerCase()

  if (comportamiento === 'TARJETA_CREDITO') return <IconoTarjeta />
  if (comportamiento === 'DEUDA') return <IconoDeuda />
  if (nombreNormalizado.includes('efectivo')) return <IconoEfectivo />
  if (nombreNormalizado.includes('banco')) return <IconoBanco />
  if (nombreNormalizado.includes('ahorro')) return <IconoAhorro />
  if (nombreNormalizado.includes('invers')) return <IconoInversion />

  return <IconoCartera />
}

function formatearSaldo(valor: string) {
  return new Intl.NumberFormat('es-PA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor))
}

export default function Cuentas() {
  const queryClient = useQueryClient()
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false)
  const [cuentaEditar, setCuentaEditar] = useState<Cuenta | undefined>()
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const {
    data: cuentas,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['cuentas'],
    queryFn: () => listarCuentas(true),
  })

  const cambiarArchivo = useMutation({
    mutationFn: async (cuenta: Cuenta) => {
      if (cuenta.archivada) {
        return desarchivarCuenta(cuenta.id)
      }

      return archivarCuenta(cuenta.id)
    },
    onSuccess: async () => {
      setErrorAccion(null)
      await queryClient.invalidateQueries({ queryKey: ['cuentas'] })
    },
    onError: (error) => {
      setErrorAccion(
        error instanceof Error
          ? error.message
          : 'No pudimos cambiar el estado de la cuenta.',
      )
    },
  })

  const cuentasActivas = cuentas?.filter((cuenta) => !cuenta.archivada) ?? []
  const cuentasArchivadas = cuentas?.filter((cuenta) => cuenta.archivada) ?? []

  function abrirEdicion(cuenta: Cuenta) {
    setCuentaEditar(cuenta)
    setMostrandoFormulario(true)
    setErrorAccion(null)
  }

  function cerrarFormulario() {
    setMostrandoFormulario(false)
    setCuentaEditar(undefined)
  }

  function alternarArchivo(cuenta: Cuenta) {
    const mensaje = cuenta.archivada
      ? `¿Quieres restaurar la cuenta "${cuenta.nombre}"?`
      : `¿Quieres archivar la cuenta "${cuenta.nombre}"?`

    if (!window.confirm(mensaje)) return

    setErrorAccion(null)
    cambiarArchivo.mutate(cuenta)
  }

  return (
    <section className="cuentas">
      <div className="cuentas__encabezado">
        <div>
          <span className="cuentas__eyebrow">Finanzas</span>
          <h2>Cuentas</h2>
          <p>Administra tus cuentas y mantén el control de tu dinero.</p>
        </div>

        {!mostrandoFormulario && (
          <button
            type="button"
            className="cuentas__boton-nueva"
            onClick={() => {
              setCuentaEditar(undefined)
              setMostrandoFormulario(true)
              setErrorAccion(null)
            }}
          >
            <span aria-hidden="true">+</span>
            Nueva cuenta
          </button>
        )}
      </div>

      {mostrandoFormulario && (
        <div className="cuentas__formulario">
          <FormularioCuenta
            key={cuentaEditar?.id ?? 'nueva'}
            cuentaEditar={cuentaEditar}
            alCancelar={cerrarFormulario}
          />
        </div>
      )}

      {errorAccion && (
        <div className="cuentas__estado cuentas__estado--error" role="alert">
          <p>{errorAccion}</p>
        </div>
      )}

      {isPending && (
        <div className="cuentas__estado">
          <p>Cargando cuentas...</p>
        </div>
      )}

      {isError && (
        <div className="cuentas__estado cuentas__estado--error" role="alert">
          <p>
            {error instanceof Error
              ? error.message
              : 'No pudimos cargar tus cuentas.'}
          </p>
        </div>
      )}

      {cuentas && (
        <>
          <div className="cuentas__resumen">
            <div className="cuentas__resumen-icono">
              <IconoCartera />
            </div>

            <div className="cuentas__resumen-total">
              <span>Total en cuentas</span>
              <strong>
                {cuentasActivas.length > 0
                  ? 'Ver saldos'
                  : 'Sin cuentas activas'}
              </strong>
            </div>

            <div className="cuentas__resumen-dato">
              <span>Activas</span>
              <strong>{cuentasActivas.length}</strong>
            </div>

            <div className="cuentas__resumen-dato">
              <span>Archivadas</span>
              <strong>{cuentasArchivadas.length}</strong>
            </div>
          </div>

          <div className="cuentas__lista">
            {cuentas.length === 0 ? (
              <div className="cuentas__vacio">
                <div className="cuentas__vacio-icono">
                  <IconoCuenta nombre="cuenta" comportamiento="NORMAL" />
                </div>

                <h3>Aún no tienes cuentas</h3>

                <p>
                  Crea tu primera cuenta para comenzar a organizar tus finanzas.
                </p>

                {!mostrandoFormulario && (
                  <button
                    type="button"
                    className="cuentas__boton-nueva"
                    onClick={() => {
                      setCuentaEditar(undefined)
                      setMostrandoFormulario(true)
                    }}
                  >
                    <span aria-hidden="true">+</span>
                    Crear primera cuenta
                  </button>
                )}
              </div>
            ) : (
              cuentas.map((cuenta) => (
                <article
                  className={`cuenta-card${cuenta.archivada ? ' cuenta-card--archivada' : ''}`}
                  key={cuenta.id}
                >
                  <div className="cuenta-card__icono">
                    <IconoCuenta
                      nombre={cuenta.tipoCuenta.nombre}
                      comportamiento={cuenta.tipoCuenta.comportamiento}
                    />
                  </div>

                  <div className="cuenta-card__contenido">
                    <div className="cuenta-card__cabecera">
                      <h3>{cuenta.nombre}</h3>
                      <span
                        className={`cuenta-card__estado${cuenta.archivada ? ' cuenta-card__estado--archivada' : ''}`}
                      >
                        {cuenta.archivada ? 'Archivada' : 'Activa'}
                      </span>
                    </div>

                    <p>
                      {cuenta.tipoCuenta.nombre}
                      <span aria-hidden="true"> · </span>
                      {cuenta.tipoCuenta.comportamiento === 'NORMAL'
                        ? 'Normal'
                        : cuenta.tipoCuenta.comportamiento === 'TARJETA_CREDITO'
                          ? 'Tarjeta de crédito'
                          : 'Deuda'}
                    </p>
                  </div>

                  <div className="cuenta-card__saldo">
                    {cuenta.saldo !== undefined
                      ? `$${formatearSaldo(cuenta.saldo)}`
                      : '—'}
                  </div>

                  <div className="cuenta-card__acciones">
                    <button
                      type="button"
                      className="cuenta-card__menu"
                      aria-label={`Editar ${cuenta.nombre}`}
                      title="Editar cuenta"
                      disabled={cambiarArchivo.isPending}
                      onClick={() => abrirEdicion(cuenta)}
                    >
                      <span />
                      <span />
                      <span />
                    </button>

                    <button
                      type="button"
                      className="cuenta-card__accion-archivo"
                      disabled={cambiarArchivo.isPending}
                      onClick={() => alternarArchivo(cuenta)}
                    >
                      {cambiarArchivo.isPending
                        ? 'Procesando...'
                        : cuenta.archivada
                          ? 'Restaurar'
                          : 'Archivar'}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  )
}

