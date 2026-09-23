import { Link, NavLink } from 'react-router'
import SelectorTema from './SelectorTema'
import '../estilos/cabecera.css'

type Props = { alCerrarSesion: () => void }

export default function Cabecera({ alCerrarSesion }: Props) {
  return (
    <header className="cabecera">
      <Link to="/" className="cabecera__marca">
        <span className="cabecera__logo" aria-hidden="true">
          G
        </span>
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
          ⏻
        </button>
      </div>
    </header>
  )
}
