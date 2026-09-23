import type { ReactNode } from 'react'
import '../estilos/auth.css'

type Props = {
  titulo: string
  subtitulo: string
  children: ReactNode
}

export default function TarjetaAuth({ titulo, subtitulo, children }: Props) {
  return (
    <div className="pantalla-auth">
      <div className="tarjeta-auth">
        <div className="tarjeta-auth__marca">
          <span className="tarjeta-auth__logo" aria-hidden="true">
            G
          </span>
          <strong>Gastos</strong>
        </div>
        <h2>{titulo}</h2>
        <p className="tarjeta-auth__subtitulo">{subtitulo}</p>
        {children}
      </div>
    </div>
  )
}
