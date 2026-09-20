import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Inicio from './paginas/Inicio'
import { borrarToken, guardarToken, obtenerToken } from './api/sesion'

function App() {
  const [token, setToken] = useState<string | null>(() => obtenerToken())

  function alAcceder(nuevoToken: string) {
    guardarToken(nuevoToken)
    setToken(nuevoToken)
  }

  function cerrarSesion() {
    borrarToken()
    setToken(null)
  }

  return (
    <main>
      <h1>Gastos</h1>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Inicio alCerrarSesion={cerrarSesion} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            token ? <Navigate to="/" replace /> : <Login alAcceder={alAcceder} />
          }
        />
        <Route
          path="/registro"
          element={
            token ? (
              <Navigate to="/" replace />
            ) : (
              <Registro alAcceder={alAcceder} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
