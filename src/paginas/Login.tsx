import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router'
import { login } from '../api/autenticacion'
import TarjetaAuth from '../componentes/TarjetaAuth'

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
    <TarjetaAuth
      titulo="Inicia sesión"
      subtitulo="Controla tus ingresos y gastos"
    >
      <form onSubmit={enviar}>
        <div className="campo">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="campo">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="principal" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="tarjeta-auth__pie">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </TarjetaAuth>
  )
}
