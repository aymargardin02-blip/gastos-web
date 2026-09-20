type Props = { alCerrarSesion: () => void }

export default function Inicio({ alCerrarSesion }: Props) {
  return (
    <section>
      <h2>Panel</h2>
      <p>Sesión iniciada. Aquí irán tu balance y tus transacciones.</p>
      <button onClick={alCerrarSesion}>Cerrar sesión</button>
    </section>
  )
}
