import { Outlet } from 'react-router'
import Cabecera from './Cabecera'

type Props = { alCerrarSesion: () => void }

export default function DisenoProtegido({ alCerrarSesion }: Props) {
  return (
    <>
      <Cabecera alCerrarSesion={alCerrarSesion} />
      <Outlet />
    </>
  )
}
