import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Inicio from './paginas/Inicio'
import Transacciones from './paginas/Transacciones'
import NuevaTransaccion from './paginas/NuevaTransaccion'
import EditarTransaccion from './paginas/EditarTransaccion'
import Categorias from './paginas/Categorias'
import NoEncontrado from './paginas/NoEncontrado'
import DisenoProtegido from './componentes/DisenoProtegido'
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

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login alAcceder={alAcceder} />} />
        <Route path="/registro" element={<Registro alAcceder={alAcceder} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route
        element={<DisenoProtegido alCerrarSesion={cerrarSesion} />}
      >
        <Route path="/" element={<Inicio />} />
        <Route path="/transacciones" element={<Transacciones />} />
        <Route path="/transacciones/nueva" element={<NuevaTransaccion />} />
        <Route
          path="/transacciones/:id/editar"
          element={<EditarTransaccion />}
        />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/registro" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}

export default App
