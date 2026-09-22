import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  actualizarTransaccion,
  obtenerTransaccion,
  type NuevaTransaccion,
} from '../api/transacciones'
import FormularioTransaccion from '../componentes/FormularioTransaccion'

export default function EditarTransaccion() {
  const { id } = useParams()
  const idNumero = Number(id)
  const idValido = Number.isInteger(idNumero) && idNumero > 0

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const transaccion = useQuery({
    queryKey: ['transaccion', idNumero],
    queryFn: () => obtenerTransaccion(idNumero),
    enabled: idValido,
  })

  const actualizar = useMutation({
    mutationFn: (datos: NuevaTransaccion) =>
      actualizarTransaccion(idNumero, datos),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transacciones'] }),
        queryClient.invalidateQueries({ queryKey: ['transaccion', idNumero] }),
        queryClient.invalidateQueries({ queryKey: ['balance'] }),
      ])
      navigate('/transacciones')
    },
  })

  const datos = transaccion.data

  return (
    <section>
      <h2>Editar transacción</h2>
     
      {!idValido && <p role="alert">La dirección no es válida.</p>}
      {idValido && transaccion.isPending && <p>Cargando transacción...</p>}
      {transaccion.error && (
        <p role="alert">{transaccion.error.message}</p>
      )}
      {datos && (
        <FormularioTransaccion
          valoresIniciales={{
            tipo: datos.tipo,
            categoriaId: String(datos.categoriaId),
            monto: datos.monto,
            fecha: datos.fecha.slice(0, 10),
            descripcion: datos.descripcion ?? '',
          }}
          textoBoton="Guardar cambios"
          textoEnviando="Guardando..."
          enviando={actualizar.isPending}
          error={actualizar.error?.message ?? null}
          alEnviar={(cambios) => actualizar.mutate(cambios)}
        />
      )}
    </section>
  )
}
