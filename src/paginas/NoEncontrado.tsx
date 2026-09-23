import { Link } from 'react-router'
import '../estilos/no-encontrado.css'

export default function NoEncontrado() {
  return (
    <section className="no-encontrado">
      <p className="no-encontrado__codigo numero">404</p>
      <h2>Página no encontrada</h2>
      <p>La dirección a la que intentaste entrar no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
