import { peticion } from './cliente'

type RespuestaLogin = { access_token: string }

export function login(email: string, contrasena: string) {
  return peticion<RespuestaLogin>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, contrasena }),
  })
}

export function registrar(nombre: string, email: string, contrasena: string) {
  return peticion<{ id: number }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, contrasena }),
  })
}
