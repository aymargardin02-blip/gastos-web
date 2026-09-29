import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router'
import { login } from '../api/autenticacion'
import TarjetaAuth from '../componentes/TarjetaAuth'

type Props = { alAcceder: (token: string) => void }

const iconoCorreo = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

const iconoCandado = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

const iconoOjo = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const iconoOjoTachado = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7c1.5 0 2.9.3 4.2.9" />
    <path d="M22 12s-3.5 7-10 7c-1.5 0-2.9-.3-4.2-.9" />
    <path d="M3 3l18 18" />
  </svg>
)

const iconoFlecha = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export default function Login({ alAcceder }: Props) {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
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
      titulo="Bienvenido de nuevo"
      subtitulo="Inicia sesión para continuar con tu gestión financiera."
    >
      <form onSubmit={enviar}>
        <div className="campo">
          <label htmlFor="email">Correo</label>
          <div className="campo__envoltorio">
            <span className="campo__icono">{iconoCorreo}</span>
            <input
              id="email"
              className="campo__input-con-icono"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="contrasena">Contraseña</label>
          <div className="campo__envoltorio">
            <span className="campo__icono">{iconoCandado}</span>
            <input
              id="contrasena"
              className="campo__input-con-icono"
              type={mostrarContrasena ? 'text' : 'password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="campo__boton-ojo"
              onClick={() => setMostrarContrasena((v) => !v)}
              aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {mostrarContrasena ? iconoOjoTachado : iconoOjo}
            </button>
          </div>
        </div>

        {error && (
          <p className="mensaje-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="principal boton-principal-ancho"
          disabled={cargando}
        >
          {cargando ? 'Entrando...' : 'Iniciar sesión'}
          {!cargando && iconoFlecha}
        </button>
      </form>

      <p className="tarjeta-auth__pie">
        ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </TarjetaAuth>
  )
}
