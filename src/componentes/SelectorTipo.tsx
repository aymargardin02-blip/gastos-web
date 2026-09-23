import { motion, useReducedMotion } from 'motion/react'
import '../estilos/selector-tipo.css'

export type Tipo = 'GASTO' | 'INGRESO'

type Props = {
  valor: Tipo
  alCambiar: (tipo: Tipo) => void
  etiquetaGrupo?: string
}

const OPCIONES: { valor: Tipo; etiqueta: string }[] = [
  { valor: 'GASTO', etiqueta: 'Gasto' },
  { valor: 'INGRESO', etiqueta: 'Ingreso' },
]

export default function SelectorTipo({
  valor,
  alCambiar,
  etiquetaGrupo = 'Tipo',
}: Props) {
  const prefiereMenosMovimiento = useReducedMotion()

  return (
    <div className="toggle-tipo" role="radiogroup" aria-label={etiquetaGrupo}>
      {OPCIONES.map(({ valor: opcion, etiqueta }) => (
        <button
          key={opcion}
          type="button"
          role="radio"
          aria-checked={valor === opcion}
          className={
            valor === opcion
              ? 'toggle-tipo__opcion activo'
              : 'toggle-tipo__opcion'
          }
          onClick={() => alCambiar(opcion)}
        >
          {valor === opcion && (
            <motion.span
              className={
                opcion === 'GASTO'
                  ? 'toggle-tipo__indicador toggle-tipo__indicador--gasto'
                  : 'toggle-tipo__indicador toggle-tipo__indicador--ingreso'
              }
              layoutId="indicador-tipo"
              transition={
                prefiereMenosMovimiento
                  ? { duration: 0.15 }
                  : { type: 'spring', bounce: 0, duration: 0.25 }
              }
            />
          )}
          <span className="toggle-tipo__texto">{etiqueta}</span>
        </button>
      ))}
    </div>
  )
}
