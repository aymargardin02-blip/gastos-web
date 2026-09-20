import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router'
import { login } from '../api/autenticacion'

type Props = { alAcceder: (token: string) => void }

export default function Login({ alAcceder }: Props) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(evento: SyntheticEvent) {
    evento.preventDefault()
    setError(null)
    setCargando(true)
    try {
      const { access_token } = await login(email, contrasena)
      alAcceder(access_token)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={enviar}>
      <h2>Iniciar sesión</h2>
      <label>
        Correo
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={cargando}>
        {cargando ? 'Entrando...' : 'Entrar'}
      </button>
      <p>
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </form>
  )
}
