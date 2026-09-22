import { Link, NavLink } from 'react-router'

type Props = { alCerrarSesion: () => void }

export default function Cabecera({ alCerrarSesion }: Props) {
  return (
    <header>
      <Link to="/">
        <h1>Gastos</h1>
      </Link>
      <nav>
        <NavLink to="/">Panel</NavLink>{' '}
        <NavLink to="/transacciones">Transacciones</NavLink>{' '}
        <NavLink to="/categorias">Categorías</NavLink>
      </nav>
      <button onClick={alCerrarSesion}>Cerrar sesión</button>
    </header>
  )
}
