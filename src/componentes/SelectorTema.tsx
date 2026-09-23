import { useEffect, useState } from 'react'
import {
  guardarTema,
  obtenerTemaGuardado,
  temaPreferidoDelSistema,
  type Tema,
} from '../api/preferenciaTema'

export default function SelectorTema() {
  const [tema, setTema] = useState<Tema>(
    () => obtenerTemaGuardado() ?? temaPreferidoDelSistema(),
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    guardarTema(tema)
  }, [tema])

  function alternar() {
    setTema((actual) => (actual === 'claro' ? 'oscuro' : 'claro'))
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tema === 'claro' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
      title={tema === 'claro' ? 'Tema oscuro' : 'Tema claro'}
    >
      {tema === 'claro' ? '🌙' : '☀️'}
    </button>
  )
}
