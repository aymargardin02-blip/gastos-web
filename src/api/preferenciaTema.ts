export type Tema = 'claro' | 'oscuro'

const CLAVE = 'gastos_tema'

export function obtenerTemaGuardado(): Tema | null {
  const valor = localStorage.getItem(CLAVE)
  return valor === 'claro' || valor === 'oscuro' ? valor : null
}

export function guardarTema(tema: Tema): void {
  localStorage.setItem(CLAVE, tema)
}

export function temaPreferidoDelSistema(): Tema {
  const prefiereOscuro = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
  return prefiereOscuro ? 'oscuro' : 'claro'
}
