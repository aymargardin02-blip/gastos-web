import { motion, useReducedMotion } from 'motion/react'
import '../estilos/auth.css'

type Props = {
  alContinuar: () => void
}

const iconoCheck = (
  <svg
    width="38"
    height="38"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
)

export default function ExitoRegistro({ alContinuar }: Props) {
  const prefiereMenosMovimiento = useReducedMotion()

  return (
    <div className="pantalla-auth pantalla-auth--exito">
      <motion.div
        className="exito-registro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefiereMenosMovimiento
            ? { duration: 0 }
            : { type: 'spring', stiffness: 300, damping: 30 }
        }
      >
        <motion.div
          className="exito-registro__circulo"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            prefiereMenosMovimiento
              ? { duration: 0 }
              : { type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }
          }
        >
          {iconoCheck}
        </motion.div>
        <h2 className="exito-registro__titulo">Cuenta creada</h2>
        <p className="exito-registro__texto">
          Tu cuenta está lista. Empieza a registrar tus movimientos.
        </p>
        <button
          type="button"
          className="principal"
          onClick={alContinuar}
        >
          Continuar
        </button>
      </motion.div>
    </div>
  )
}
