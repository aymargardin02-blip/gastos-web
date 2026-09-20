import { useEffect, useState } from 'react'

type Salud = { estado: string; servicio: string }

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [salud, setSalud] = useState<Salud | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/salud`)
      .then((respuesta) => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
        return respuesta.json()
      })
      .then((datos: Salud) => setSalud(datos))
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <main>
      <h1>Gastos</h1>
      {error && <p>No se pudo conectar con la API: {error}</p>}
      {!error && !salud && <p>Conectando con la API...</p>}
      {salud && (
        <p>
          API funcionando: {salud.servicio} ({salud.estado})
        </p>
      )}
    </main>
  )
}

export default App
