import { Outlet } from 'react-router'
import Cabecera from './Cabecera'
import NavegacionInferior from './NavegacionInferior'

type Props = { alCerrarSesion: () => void }

export default function DisenoProtegido({ alCerrarSesion }: Props) {
  return (
    <>
      <Cabecera alCerrarSesion={alCerrarSesion} />
      <main className="contenido-protegido">
        <Outlet />
      </main>
      <NavegacionInferior />
    </>
  )
}
