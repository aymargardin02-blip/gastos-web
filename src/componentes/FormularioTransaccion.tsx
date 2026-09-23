import { useState, type SyntheticEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listarCategorias } from '../api/categorias'
import type { NuevaTransaccion } from '../api/transacciones'
import SelectorTipo, { type Tipo } from './SelectorTipo'
import '../estilos/formulario-transaccion.css'

export type ValoresFormulario = {
  tipo: Tipo
  categoriaId: string
  monto: string
  fecha: string
  descripcion: string
}

type Props = {
  valoresIniciales: ValoresFormulario
  textoBoton: string
  textoEnviando: string
  enviando: boolean
  error: string | null
  alEnviar: (datos: NuevaTransaccion) => void
}

export default function FormularioTransaccion({
  valoresIniciales,
  textoBoton,
  textoEnviando,
  enviando,
  error,
  alEnviar,
}: Props) {
  const [tipo, setTipo] = useState<Tipo>(valoresIniciales.tipo)
  const [categoriaId, setCategoriaId] = useState(valoresIniciales.categoriaId)
  const [monto, setMonto] = useState(valoresIniciales.monto)
  const [fecha, setFecha] = useState(valoresIniciales.fecha)
  const [descripcion, setDescripcion] = useState(valoresIniciales.descripcion)

  const categorias = useQuery({
    queryKey: ['categorias'],
    queryFn: () => listarCategorias(),
  })

  const categoriasDelTipo = (categorias.data ?? []).filter(
    (c) => c.tipo === tipo,
  )

  function cambiarTipo(nuevoTipo: Tipo) {
    setTipo(nuevoTipo)
    setCategoriaId('')
  }

  function enviar(evento: SyntheticEvent) {
    evento.preventDefault()
    alEnviar({
      tipo,
      monto: Number(monto),
      descripcion: descripcion.trim() || undefined,
      fecha,
      categoriaId: Number(categoriaId),
    })
  }

  return (
    <form className="formulario-transaccion" onSubmit={enviar}>
      {categorias.error && (
        <p className="formulario-transaccion__error" role="alert">
          {categorias.error.message}
        </p>
      )}

      <SelectorTipo
        valor={tipo}
        alCambiar={cambiarTipo}
        etiquetaGrupo="Tipo de transacción"
      />

      <label className="campo">
        Categoría
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Elige una categoría</option>
          {categoriasDelTipo.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>
      {categorias.isSuccess && categoriasDelTipo.length === 0 && (
        <p className="formulario-transaccion__aviso">
          Todavía no tienes categorías de{' '}
          {tipo === 'GASTO' ? 'gasto' : 'ingreso'}.
        </p>
      )}

      <div className="formulario-transaccion__fila">
        <label className="campo">
          Monto
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </label>
        <label className="campo">
          Fecha
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>
      </div>

      <label className="campo">
        Descripción (opcional)
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && (
        <p className="formulario-transaccion__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="principal" disabled={enviando}>
        {enviando ? textoEnviando : textoBoton}
      </button>
    </form>
  )
}
