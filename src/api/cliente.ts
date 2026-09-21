import { obtenerToken } from './sesion'

const API_URL = import.meta.env.VITE_API_URL as string

export class ErrorApi extends Error {
  estado: number

  constructor(estado: number, mensaje: string) {
    super(mensaje)
    this.estado = estado
  }
}

export async function peticion<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const token = obtenerToken()

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opciones.headers,
    },
  })

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) {
      window.dispatchEvent(new Event('sesion-expirada'))
    }
    const mensaje = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : (datos?.message ?? 'Error inesperado')
    throw new ErrorApi(respuesta.status, mensaje)
  }

  return datos as T
}
