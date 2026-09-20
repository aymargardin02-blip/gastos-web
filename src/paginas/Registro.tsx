import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router'
import { login, registrar } from '../api/autenticacion'

type Props = { alAcceder: (token: string) => void }

export default function Registro({ alAcceder }: Props) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(evento: SyntheticEvent) {
    evento.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await registrar(nombre, email, contrasena)
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
      <h2>Crear cuenta</h2>
      <label>
        Nombre
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
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
        Contraseña (mínimo 8 caracteres)
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          minLength={8}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={cargando}>
        {cargando ? 'Creando cuenta...' : 'Registrarme'}
      </button>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  )
}
