import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import '../estilos/auth.css'

type Props = {
  titulo: string
  subtitulo: string
  children: ReactNode
}

export default function TarjetaAuth({ titulo, subtitulo, children }: Props) {
  const prefiereMenosMovimiento = useReducedMotion()

  return (
    <div className="pantalla-auth">
      <motion.div
        className="tarjeta-auth"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          prefiereMenosMovimiento
            ? { duration: 0 }
            : { type: 'spring', stiffness: 300, damping: 30 }
        }
      >
        <div className="tarjeta-auth__marca">Gastos</div>
        <h2>{titulo}</h2>
        <p className="tarjeta-auth__subtitulo">{subtitulo}</p>
        {children}
      </motion.div>
    </div>
  )
}
