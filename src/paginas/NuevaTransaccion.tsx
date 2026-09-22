import { Link, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearTransaccion } from '../api/transacciones'
import { hoy } from '../utilidades/fechas'
import FormularioTransaccion, {
  type ValoresFormulario,
} from '../componentes/FormularioTransaccion'

export default function NuevaTransaccion() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const crear = useMutation({
    mutationFn: crearTransaccion,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transacciones'] }),
        queryClient.invalidateQueries({ queryKey: ['balance'] }),
      ])
      navigate('/transacciones')
    },
  })

  const valoresIniciales: ValoresFormulario = {
    tipo: 'GASTO',
    categoriaId: '',
    monto: '',
    fecha: hoy(),
    descripcion: '',
  }

  return (
    <section>
      <h2>Nueva transacción</h2>
      <p>
        <Link to="/transacciones">← Volver a la lista</Link>
      </p>
      <FormularioTransaccion
        valoresIniciales={valoresIniciales}
        textoBoton="Guardar"
        textoEnviando="Guardando..."
        enviando={crear.isPending}
        error={crear.error?.message ?? null}
        alEnviar={(datos) => crear.mutate(datos)}
      />
    </section>
  )
}
