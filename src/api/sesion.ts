const CLAVE = 'gastos_token'

export function obtenerToken(): string | null {
  return localStorage.getItem(CLAVE)
}

export function guardarToken(token: string): void {
  localStorage.setItem(CLAVE, token)
}

export function borrarToken(): void {
  localStorage.removeItem(CLAVE)
}
