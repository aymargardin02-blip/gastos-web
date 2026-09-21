import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Inicio from './paginas/Inicio'
import Transacciones from './paginas/Transacciones'
import { borrarToken, guardarToken, obtenerToken } from './api/sesion'

function App() {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(() => obtenerToken())

  const cerrarSesion = useCallback(() => {
    borrarToken()
    queryClient.clear()
    setToken(null)
  }, [queryClient])

  useEffect(() => {
    window.addEventListener('sesion-expirada', cerrarSesion)
    return () => window.removeEventListener('sesion-expirada', cerrarSesion)
  }, [cerrarSesion])

  function alAcceder(nuevoToken: string) {
    guardarToken(nuevoToken)
    setToken(nuevoToken)
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
          path="/transacciones"
          element={token ? <Transacciones /> : <Navigate to="/login" replace />}
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
