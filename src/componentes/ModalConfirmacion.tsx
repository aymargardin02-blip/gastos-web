import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import '../estilos/modal-confirmacion.css'

type Props = {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  peligro?: boolean
  cargando?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligro = false,
  cargando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  const prefiereMenosMovimiento = useReducedMotion()

  const transicionFondo = prefiereMenosMovimiento
    ? { duration: 0.15 }
    : { duration: 0.2 }

   const transicionTarjeta = prefiereMenosMovimiento
    ? { duration: 0.15 }
    : { type: 'spring' as const, bounce: 0, duration: 0.28 }
    
  return (
    <AnimatePresence mode="wait">
      {abierto && (
        <motion.div
          key="fondo-modal"
          className="modal-confirmacion__fondo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transicionFondo}
          onClick={onCancelar}
        >
          <motion.div
            key="tarjeta-modal"
            className="modal-confirmacion__tarjeta"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modal-confirmacion-titulo"
            aria-describedby="modal-confirmacion-mensaje"
            initial={
              prefiereMenosMovimiento
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 12 }
            }
            animate={
              prefiereMenosMovimiento
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              prefiereMenosMovimiento
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={transicionTarjeta}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-confirmacion-titulo">{titulo}</h3>
            <p id="modal-confirmacion-mensaje">{mensaje}</p>
            <div className="modal-confirmacion__acciones">
              <button type="button" onClick={onCancelar} disabled={cargando}>
                {textoCancelar}
              </button>
              <button
                type="button"
                className={peligro ? 'peligro' : 'principal'}
                onClick={onConfirmar}
                disabled={cargando}
              >
                {cargando ? 'Eliminando…' : textoConfirmar}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
