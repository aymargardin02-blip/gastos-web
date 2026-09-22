import { Link } from 'react-router'

export default function NoEncontrado() {
  return (
    <section>
      <h2>Página no encontrada</h2>
      <p>La dirección a la que intentaste entrar no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}
