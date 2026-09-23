import { NavLink } from 'react-router'
import '../estilos/navegacion-inferior.css'

function IconoPanel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1V10.5Z" />
    </svg>
  )
}

function IconoTransacciones() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
  )
}

function IconoCategorias() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" />
      <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

const enlaces = [
  { ruta: '/', fin: true, etiqueta: 'Panel', Icono: IconoPanel },
  { ruta: '/transacciones', fin: false, etiqueta: 'Transacciones', Icono: IconoTransacciones },
  { ruta: '/categorias', fin: false, etiqueta: 'Categorías', Icono: IconoCategorias },
]

export default function NavegacionInferior() {
  return (
    <nav className="navegacion-inferior" aria-label="Navegación principal">
      {enlaces.map(({ ruta, fin, etiqueta, Icono }) => (
        <NavLink
          key={ruta}
          to={ruta}
          end={fin}
          className={({ isActive }) =>
            isActive ? 'navegacion-inferior__item activo' : 'navegacion-inferior__item'
          }
        >
          <Icono />
          <span>{etiqueta}</span>
        </NavLink>
      ))}
    </nav>
  )
}
