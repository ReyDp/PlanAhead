# PlanAhead

PlanAhead es una aplicacion web para gestion academica orientada a estudiantes universitarios. Permite organizar materias, tareas, metas y fechas importantes usando planificacion anticipada: cada tarea tiene una fecha limite oficial y una fecha meta personal para ayudar a entregar antes de tiempo.

El proyecto esta dividido en dos aplicaciones:

- `planahead-backend`: API REST con Node.js, Express, Prisma y SQLite.
- `planahead-frontend`: aplicacion React con Vite, React Router y CSS Modules.

---

## Funcionalidades

### Autenticacion

- Registro de usuarios.
- Inicio de sesion con email y password.
- Autenticacion protegida con JWT.
- Token guardado en `localStorage`.
- Rutas privadas en el frontend.
- Logout desde la barra de navegacion.

### Dashboard academico

- Resumen del usuario autenticado.
- Conteo de tareas pendientes.
- Conteo de tareas criticas y urgentes.
- Alertas de tareas en estado critico o alto.
- Lista de tareas del dia ordenadas por urgencia.
- Marcado rapido de tareas como completadas.
- Feedback visual al completar una tarea.
- Progreso por materia con barras visuales.

### Tareas

- Listado de tareas del usuario.
- Creacion de tareas.
- Edicion de tareas.
- Eliminacion disponible desde API.
- Cambio de estado de tareas.
- Filtros por estado.
- Filtros por materia.
- Modal de crear/editar tarea.
- Validacion de fechas: `fechaMeta` debe ser anterior a `fechaLimite`.
- Calculo visual de urgencia:
  - `CRITICA`: meta vencida.
  - `ALTA`: vence hoy o manana.
  - `MEDIA`: vence pronto.
  - `BAJA`: sin urgencia inmediata.

### Materias

- Listado de materias del usuario.
- Creacion de materias desde API.
- Colores por materia para identificacion visual.
- Conteo de tareas asociadas.

### Calendario

- Vista mensual.
- Navegacion por mes anterior y siguiente.
- Agrupacion de tareas por dia.
- Puntos de color por materia dentro de cada fecha.
- Detalle de tareas al seleccionar un dia.
- Consulta por `mes` y `anio`.

### Metas

- Listado de metas academicas.
- Creacion de metas desde API.
- Progreso de metas basado en tareas creadas dentro del rango de fechas.
- Porcentaje de tareas completadas por meta.
- Tipos de meta:
  - `DIARIA`
  - `SEMANAL`
  - `PERSONALIZADA`

### Experiencia de usuario

- Login profesional en dos columnas.
- Navegacion sticky.
- Estados de loading con skeletons.
- Estados vacios.
- Estados de error con reintento.
- Transiciones suaves.
- Hover en botones y cards.
- Focus accesible en inputs.
- Scroll suave.
- Diseno responsive para escritorio y movil.

---

## Tecnologias y frameworks utilizados

### Frontend

- React 18
- Vite
- React Router DOM v6
- CSS Modules
- CSS3
- HTML5
- JavaScript ES Modules
- Fetch API nativa
- LocalStorage

### Backend

- Node.js
- Express.js
- Prisma ORM
- SQLite
- JSON Web Tokens con `jsonwebtoken`
- `bcryptjs` para hash de contrasenas
- `dotenv` para variables de entorno
- `cors`
- Nodemon para desarrollo

### Base de datos

- SQLite
- Prisma Client
- Prisma Schema
- Prisma Migrations
- Seed de datos demo

### Herramientas de desarrollo

- npm
- PowerShell
- Git
- Vite Dev Server
- Proxy de Vite para API:
  - `/api` -> `http://localhost:3000`

---

## Arquitectura

```text
planahead-frontend (React + Vite)
        |
        | HTTP / Fetch / API REST
        v
planahead-backend (Express + Prisma)
        |
        v
SQLite
```

El frontend consume la API usando rutas `/api/...`. En desarrollo, Vite redirige esas rutas al backend con proxy para evitar problemas de CORS.

---

## Estructura del proyecto

```text
PlanAhead/
|
|-- planahead-backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   |-- seed.js
|   |   `-- migrations/
|   |-- src/
|   |   |-- index.js
|   |   |-- lib/
|   |   |   `-- prisma.js
|   |   |-- middleware/
|   |   |   `-- auth.js
|   |   `-- routes/
|   |       |-- auth.js
|   |       |-- calendario.js
|   |       |-- dashboard.js
|   |       |-- materias.js
|   |       |-- metas.js
|   |       `-- tareas.js
|   |-- package.json
|   `-- .env
|
|-- planahead-frontend/
|   |-- index.html
|   |-- vite.config.js
|   |-- src/
|   |   |-- main.jsx
|   |   |-- App.jsx
|   |   |-- context/
|   |   |   `-- AuthContext.jsx
|   |   |-- components/
|   |   |   |-- Navbar.jsx
|   |   |   |-- PrivateRoute.jsx
|   |   |   `-- SkeletonCard.jsx
|   |   |-- lib/
|   |   |   |-- api.js
|   |   |   `-- dates.js
|   |   |-- pages/
|   |   |   |-- LoginPage.jsx
|   |   |   |-- DashboardPage.jsx
|   |   |   |-- TareasPage.jsx
|   |   |   |-- CalendarioPage.jsx
|   |   |   `-- MetasPage.jsx
|   |   `-- styles/
|   |       `-- global.css
|   `-- package.json
|
`-- README.md
```

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/ReyDp/PlanAhead.git
cd PlanAhead
```

### 2. Instalar dependencias del backend

```powershell
cd planahead-backend
npm.cmd install
```

### 3. Instalar dependencias del frontend

```powershell
cd ..\planahead-frontend
npm.cmd install
```

---

## Variables de entorno del backend

El archivo `planahead-backend/.env` debe tener:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="secreto_local_desarrollo"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

---

## Base de datos y datos demo

Para cargar los datos de demostracion:

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-backend
npm.cmd run db:seed
```

Credenciales demo:

```text
Email: carlos@demo.com
Password: demo1234
```

El seed crea:

- Usuario demo.
- 5 materias.
- 9 tareas distribuidas por urgencia.
- 2 metas academicas.
- Fechas relativas a la fecha actual para que la demo siempre este vigente.

---

## Ejecucion en desarrollo

Se deben ejecutar backend y frontend en terminales separadas.

### Backend

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-backend
npm.cmd run dev
```

Servidor:

```text
http://localhost:3000
```

### Frontend

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-frontend
npm.cmd run dev
```

Aplicacion:

```text
http://localhost:5173
```

Si el puerto `3000` esta ocupado, significa que probablemente el backend ya esta corriendo. Puedes verificarlo con:

```powershell
netstat -ano | findstr :3000
```

---

## Scripts disponibles

### Backend

```json
{
  "dev": "nodemon src/index.js",
  "db:migrate": "prisma migrate dev --name init",
  "db:seed": "node prisma/seed.js",
  "db:reset": "prisma migrate reset --force && node prisma/seed.js"
}
```

### Frontend

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## API REST

Todas las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Materias

- `GET /api/materias`
- `POST /api/materias`

### Tareas

- `GET /api/tareas`
- `POST /api/tareas`
- `PUT /api/tareas/:id`
- `DELETE /api/tareas/:id`

### Dashboard

- `GET /api/dashboard`

### Calendario

- `GET /api/calendario?mes=5&anio=2026`

### Metas

- `GET /api/metas`
- `POST /api/metas`
- `GET /api/metas/progreso`

---

## Modelos principales

### Usuario

- `id`
- `nombre`
- `email`
- `password`
- `carrera`
- `semestre`

### Materia

- `id`
- `nombre`
- `color`
- `usuarioId`

### Tarea

- `id`
- `titulo`
- `descripcion`
- `fechaLimite`
- `fechaMeta`
- `prioridad`
- `estado`
- `usuarioId`
- `materiaId`

### Meta

- `id`
- `titulo`
- `tipo`
- `fechaInicio`
- `fechaFin`
- `usuarioId`

---

## Flujo de uso para demo

1. Ejecutar backend.
2. Ejecutar frontend.
3. Abrir `http://localhost:5173`.
4. Iniciar sesion con:

```text
carlos@demo.com
demo1234
```

5. Mostrar:
   - Dashboard con alertas y progreso.
   - Tareas filtrables.
   - Modal para crear/editar tareas.
   - Calendario mensual.
   - Metas con progreso.

---

## Estado del proyecto

MVP funcional para feria tecnologica. Incluye autenticacion, dashboard, gestion de tareas, calendario, metas, progreso por materia y datos demo.

---

## Mejoras futuras

- Notificaciones push.
- Recordatorios por correo.
- Sincronizacion con Google Calendar.
- Estadisticas avanzadas por semestre.
- Vista por semana.
- Roles de usuario.
- Version movil nativa.
- PWA completa con modo offline.

---

## Autor

Desarrollado por 
**Reynaldo Jose Duran Pertuz**.
**Ana Carolina Sierra**.
**Sergio Luis Sanchez Barrios**.

---

## Licencia

Proyecto bajo licencia MIT.
