# Gastos Web

Frontend en **React** y **TypeScript** para gestionar ingresos y gastos personales, construido sobre la API [`gastos-api`](https://github.com/aymargardin02-blip/gastos-api). Permite registrarse, iniciar sesión, crear categorías, registrar transacciones y ver el balance en tiempo real, con un diseño propio inspirado en apps de fintech.

**Demo en producción:** https://gastos-web-peach.vercel.app

> El frontend consume la API alojada en un plan gratuito: si lleva un rato sin recibir peticiones, la primera carga puede tardar unos segundos mientras el servicio se reactiva.

## Capturas
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
<!-- Inserta aquí 2-4 capturas: Panel (claro y oscuro), Transacciones, Categorías en edición -->

## Funcionalidades

- Registro e inicio de sesión contra la API, con token guardado en `localStorage` y cierre de sesión automático cuando el token caduca.
- Rutas protegidas: sin sesión, redirige siempre a login.
- **Panel** con balance real (ingresos, gastos, diferencia) y filtro por rango de fechas.
- **Transacciones**: crear, editar y eliminar con un formulario reutilizable; listado con filtros y paginación.
- **Categorías**: crear, editar en línea y eliminar, con confirmación antes de borrar.
- Modo claro/oscuro con preferencia guardada y detección automática del sistema.
- Diseño propio (sin librería de UI ni de iconos): paleta de marca, componentes y animaciones hechos a medida.
- Accesibilidad: anillos de foco visibles en todos los elementos interactivos, y animaciones que respetan `prefers-reduced-motion`.

## Tecnologías

| Área | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite |
| Enrutado | React Router 8 |
| Datos remotos | TanStack Query |
| Animación | Motion |
| Estilos | CSS plano (sin librerías), variables CSS por tema |
| Linter | Oxlint |
| Backend | [`gastos-api`](https://github.com/aymargardin02-blip/gastos-api) (NestJS + PostgreSQL) |
| Despliegue | Vercel |

## Instalación local

### Requisitos

- Node.js 24 LTS
- La [API de gastos](https://github.com/aymargardin02-blip/gastos-api) corriendo (local o la de producción)

### Pasos

1. Clona el repositorio e instala las dependencias:

```bash
   git clone https://github.com/aymargardin02-blip/gastos-web.git
   cd gastos-web
   npm install
```

2. Copia la plantilla de variables de entorno:

```bash
   cp .env.example .env.local
```

   En PowerShell: `Copy-Item .env.example .env.local`

3. Arranca el servidor de desarrollo:

```bash
   npm run dev
```

La app queda en http://localhost:5173 (o el puerto que indique Vite).

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API, por ejemplo `http://localhost:3000` en local o `https://gastos-api-r7db.onrender.com` para usar la API de producción |

El archivo `.env.local` está en `.gitignore` y nunca se sube al repositorio.

## Estructura del proyecto
gastos-web/
├─ src/
│ ├─ api/ # cliente HTTP, autenticación, llamadas a la API
│ ├─ componentes/ # componentes reutilizables (layout, modales, selectores)
│ ├─ paginas/ # una por ruta: Login, Registro, Inicio, Transacciones, Categorías...
│ ├─ estilos/ # CSS por pantalla/componente, tema y variables de marca
│ ├─ App.tsx # rutas y control de sesión
│ └─ main.tsx # punto de entrada
├─ .env.example
└─ vite.config.ts

## Decisiones técnicas

- **Diseño propio, sin librería de UI ni de iconos.** Los iconos son SVG inline hechos a medida, para mantener control total sobre la paleta y el trazo en ambos temas.
- **Verde oscuro como color de marca en ambos temas** (no solo en "modo oscuro"), con un lima vibrante reservado únicamente para elementos interactivos — evita el patrón genérico de "azul de botón" que traen la mayoría de plantillas.
- **Cierre de sesión centralizado por token caducado**: un evento global (`sesion-expirada`) desloguea al usuario desde cualquier punto de la app en el que la API responda 401, sin duplicar esa lógica en cada pantalla.
- **TanStack Query** para todo el estado remoto (listas, balance): cachea, revalida y evita pedir a mano los estados de carga/error en cada pantalla.
- **Motion con la API `bounce`/`duration`** en vez de parámetros físicos crudos (`stiffness`/`damping`), para animaciones predecibles y sin rebote no deseado.
- **Accesibilidad de foco tratada como requisito, no como detalle**: anillo de foco visible en todos los botones y links, y `useReducedMotion()` en cada animación con Motion.

## Limitaciones conocidas y mejoras futuras

- El token se guarda en `localStorage`; migrar a cookies `httpOnly` queda como mejora de seguridad futura.
- No hay fila deslizable ("swipe to delete") en transacciones — se evaluó pero no se llegó a construir.
- Ideas futuras: gráficos de gastos por categoría, exportar transacciones, soporte multi-cuenta.

## Autor

Aymar Gardin · [LinkedIn](https://www.linkedin.com/) · aymargardin02@gmail.com