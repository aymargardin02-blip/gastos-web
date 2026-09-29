import { motion, useReducedMotion } from 'motion/react'
import '../estilos/auth.css'

type Props = {
  titulo: string
  subtitulo: string
  children: React.ReactNode
}

const logoHojas = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20.5 3.5C13.1 4.1 7.8 7.3 6.1 12.1c-1 2.9.2 5.9 2.7 7.3 2.8-5.2 6.2-9.1 11.7-12.6Z"
      fill="currentColor"
    />
    <path
      d="M4.1 20.2c2.1-3.9 5.3-6.5 9.8-8.1"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

const ilustracion = (
  <svg
    viewBox="0 0 220 220"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="144"
      cy="76"
      r="76"
      fill="var(--auth-ilustracion-fondo)"
    />

    <path
      d="M118 116C128 83 150 56 181 39C174 73 153 99 118 116Z"
      fill="var(--auth-ilustracion-hoja)"
    />

    <path
      d="M118 116C127 96 143 77 162 62"
      stroke="var(--auth-ilustracion-hoja-detalle)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M151 123C157 101 173 85 195 77C190 99 175 116 151 123Z"
      fill="var(--auth-ilustracion-hoja-secundaria)"
    />

    <path
      d="M153 122C163 108 174 97 187 89"
      stroke="var(--auth-ilustracion-hoja-detalle)"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    <rect
      x="176"
      y="91"
      width="10"
      height="43"
      rx="5"
      fill="var(--auth-ilustracion-barra)"
    />

    <rect
      x="191"
      y="75"
      width="10"
      height="59"
      rx="5"
      fill="var(--auth-ilustracion-barra)"
      opacity="0.82"
    />

    <rect
      x="206"
      y="57"
      width="10"
      height="77"
      rx="5"
      fill="var(--auth-ilustracion-barra)"
      opacity="0.66"
    />

    <ellipse
      cx="126"
      cy="145"
      rx="23"
      ry="7"
      fill="var(--auth-ilustracion-maceta)"
      opacity="0.55"
    />

    <ellipse
      cx="126"
      cy="139"
      rx="22"
      ry="7"
      fill="var(--auth-ilustracion-maceta)"
      opacity="0.82"
    />

    <ellipse
      cx="126"
      cy="132"
      rx="19"
      ry="6"
      fill="var(--auth-ilustracion-maceta)"
    />
  </svg>
)

export default function TarjetaAuth({
  titulo,
  subtitulo,
  children,
}: Props) {
  const prefiereMenosMovimiento = useReducedMotion()

  return (
    <main className="pantalla-auth">
      <motion.section
        className="tarjeta-auth"
        initial={
          prefiereMenosMovimiento
            ? { opacity: 0 }
            : { opacity: 0, y: 18, scale: 0.985 }
        }
        animate={
          prefiereMenosMovimiento
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={
          prefiereMenosMovimiento
            ? { duration: 0 }
            : {
                type: 'spring',
                stiffness: 260,
                damping: 26,
              }
        }
      >
        <div className="tarjeta-auth__ilustracion">
          {ilustracion}
        </div>

        <div className="tarjeta-auth__contenido">
          <header className="tarjeta-auth__encabezado">
            <div className="tarjeta-auth__marca">
              <span className="tarjeta-auth__marca-icono">
                {logoHojas}
              </span>

              <span>Gastos</span>
            </div>

            <h1 className="tarjeta-auth__titulo">{titulo}</h1>

            <p className="tarjeta-auth__subtitulo">
              {subtitulo}
            </p>
          </header>

          <div className="tarjeta-auth__cuerpo">
            {children}
          </div>
        </div>
      </motion.section>
    </main>
  )
}
