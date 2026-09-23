import { Link, NavLink } from 'react-router'
import SelectorTema from './SelectorTema'
import '../estilos/cabecera.css'

type Props = { alCerrarSesion: () => void }

export default function Cabecera({ alCerrarSesion }: Props) {
  return (
    <header className="cabecera">
      <Link to="/" className="cabecera__marca">
        <h1>Gastos</h1>
      </Link>
      <nav className="cabecera__nav">
        <NavLink to="/" end>
          Panel
        </NavLink>
        <NavLink to="/transacciones">Transacciones</NavLink>
        <NavLink to="/categorias">Categorías</NavLink>
      </nav>
      <div className="cabecera__acciones">
        <SelectorTema />
        <button
          type="button"
          className="boton-icono"
          onClick={alCerrarSesion}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  )
}
