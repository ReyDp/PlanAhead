<div align="center">

# 🚀 PlanAhead

### Agenda académica inteligente para planificar tareas, metas y entregas antes de tiempo.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=0F172A)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## 📌 Descripción

**PlanAhead** es una aplicación web para estudiantes universitarios que ayuda a organizar materias, tareas, metas y fechas importantes con un enfoque de **planificación anticipada**.

La diferencia principal frente a una agenda tradicional es que cada tarea maneja dos fechas:

| Fecha | Significado |
|---|---|
| 📅 `fechaLimite` | Fecha oficial de entrega |
| 🎯 `fechaMeta` | Fecha personal para terminar antes |

Esto permite detectar tareas críticas, priorizar mejor el trabajo y reducir el riesgo de entregar tarde.

---

## ✨ Funcionalidades principales

### 🔐 Autenticación

- Registro de usuarios.
- Inicio de sesión con email y contraseña.
- Autenticación con **JWT**.
- Token guardado en `localStorage`.
- Rutas privadas en React.
- Logout desde la navegación.

### 📊 Dashboard académico

- Saludo personalizado al usuario.
- Resumen de tareas pendientes.
- Conteo de tareas críticas y urgentes.
- Alertas visuales por urgencia.
- Tareas del día ordenadas por prioridad.
- Marcado rápido de tareas como completadas.
- Feedback visual: `Tarea completada ✓`.
- Progreso por materia con barras animadas.

### ✅ Gestión de tareas

- Crear tareas.
- Editar tareas.
- Cambiar estado de tareas.
- Filtrar por estado.
- Filtrar por materia.
- Validar fechas desde el frontend.
- Ver urgencia visual por tarea.

Estados disponibles:

| Estado | Descripción |
|---|---|
| `PENDIENTE` | Tarea creada, aún sin iniciar |
| `EN_PROGRESO` | Tarea en desarrollo |
| `COMPLETADA` | Tarea finalizada |

Urgencias calculadas:

| Urgencia | Regla |
|---|---|
| 🔴 `CRITICA` | La fecha meta ya pasó |
| 🟠 `ALTA` | Vence hoy o mañana |
| 🟡 `MEDIA` | Vence pronto |
| 🟢 `BAJA` | No requiere atención inmediata |

### 📚 Materias

- Listado de materias del usuario.
- Colores personalizados por materia.
- Conteo de tareas asociadas.
- Creación disponible desde API.

### 🗓️ Calendario

- Vista mensual.
- Navegación entre meses.
- Tareas agrupadas por día.
- Puntos de color según materia.
- Detalle de tareas al seleccionar una fecha.
- Consulta por `mes` y `anio`.

### 🎯 Metas

- Listado de metas académicas.
- Creación de metas desde API.
- Progreso por rango de fechas.
- Porcentaje de tareas completadas.

Tipos de meta:

- `DIARIA`
- `SEMANAL`
- `PERSONALIZADA`

### 🎨 Experiencia de usuario

- Login profesional en dos columnas.
- Navbar sticky.
- Skeleton loading.
- Estados vacíos.
- Estados de error con reintento.
- Transiciones suaves.
- Hover en botones y cards.
- Focus accesible en inputs.
- Diseño responsive.

---

## 🧰 Tecnologías utilizadas

### Frontend

| Tecnología | Uso |
|---|---|
| ⚛️ React 18 | Construcción de interfaz |
| ⚡ Vite | Dev server y build |
| 🧭 React Router DOM v6 | Navegación SPA |
| 🎨 CSS Modules | Estilos por componente |
| 🌐 Fetch API | Consumo de API |
| 💾 LocalStorage | Persistencia del token |
| 🧱 HTML5 / CSS3 | Estructura y diseño |

### Backend

| Tecnología | Uso |
|---|---|
| 🟩 Node.js | Runtime del servidor |
| 🚏 Express.js | API REST |
| 🔐 JSON Web Token | Autenticación |
| 🔑 bcryptjs | Hash de contraseñas |
| 🧬 Prisma ORM | Acceso a base de datos |
| 🗄️ SQLite | Base de datos local |
| ⚙️ dotenv | Variables de entorno |
| 🔄 nodemon | Recarga en desarrollo |
| 🌍 cors | Configuración CORS |

### Herramientas

- npm
- PowerShell
- Git / GitHub
- Prisma Migrations
- Prisma Seed
- Vite Proxy `/api -> http://localhost:3000`

---

## 🏗️ Arquitectura

```text
┌──────────────────────────────┐
│   Frontend: React + Vite     │
│   http://localhost:5173      │
└───────────────┬──────────────┘
                │ Fetch / API REST
                ▼
┌──────────────────────────────┐
│   Backend: Node + Express    │
│   http://localhost:3000      │
└───────────────┬──────────────┘
                │ Prisma ORM
                ▼
┌──────────────────────────────┐
│        SQLite Database       │
└──────────────────────────────┘
```

---

## 📁 Estructura del proyecto

```text
PlanAhead/
│
├── planahead-backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── index.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── calendario.js
│   │       ├── dashboard.js
│   │       ├── materias.js
│   │       ├── metas.js
│   │       └── tareas.js
│   │
│   └── package.json
│
├── planahead-frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── SkeletonCard.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── dates.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TareasPage.jsx
│   │   │   ├── CalendarioPage.jsx
│   │   │   └── MetasPage.jsx
│   │   └── styles/
│   │       └── global.css
│   │
│   └── package.json
│
└── README.md
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ReyDp/PlanAhead.git
cd PlanAhead
```

### 2. Instalar backend

```powershell
cd planahead-backend
npm.cmd install
```

### 3. Instalar frontend

```powershell
cd ..\planahead-frontend
npm.cmd install
```

---

## 🔧 Variables de entorno

Archivo: `planahead-backend/.env`

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="secreto_local_desarrollo"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

---

## 🌱 Datos demo

Para cargar la demo:

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-backend
npm.cmd run db:seed
```

Credenciales:

```text
Email: carlos@demo.com
Password: demo1234
```

El seed crea:

- 👤 Usuario demo: Carlos Mendoza.
- 📚 5 materias.
- ✅ 9 tareas con diferentes niveles de urgencia.
- 🎯 2 metas académicas.
- 📅 Fechas relativas a la fecha actual.

---

## ▶️ Ejecución

Debes abrir **dos terminales**.

### Terminal 1: Backend

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-backend
npm.cmd run dev
```

Servidor:

```text
http://localhost:3000
```

### Terminal 2: Frontend

```powershell
cd D:\UDC\Feria\PlanAhead\planahead-frontend
npm.cmd run dev
```

Aplicación:

```text
http://localhost:5173
```

> Si aparece `EADDRINUSE: address already in use :::3000`, significa que el backend ya está corriendo en el puerto `3000`.

---

## 📜 Scripts

### Backend

| Comando | Descripción |
|---|---|
| `npm.cmd run dev` | Inicia Express con nodemon |
| `npm.cmd run db:migrate` | Ejecuta migraciones Prisma |
| `npm.cmd run db:seed` | Carga datos demo |
| `npm.cmd run db:reset` | Reinicia la base y carga seed |

### Frontend

| Comando | Descripción |
|---|---|
| `npm.cmd run dev` | Inicia Vite |
| `npm.cmd run build` | Genera build de producción |
| `npm.cmd run preview` | Previsualiza el build |

---

## 🔌 API REST

Todas las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |

### Materias

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/materias` | Listar materias |
| `POST` | `/api/materias` | Crear materia |

### Tareas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/tareas` | Listar tareas |
| `POST` | `/api/tareas` | Crear tarea |
| `PUT` | `/api/tareas/:id` | Editar tarea |
| `DELETE` | `/api/tareas/:id` | Eliminar tarea |

### Dashboard

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/dashboard` | Resumen general |

### Calendario

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/calendario?mes=5&anio=2026` | Tareas por mes |

### Metas

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/metas` | Listar metas |
| `POST` | `/api/metas` | Crear meta |
| `GET` | `/api/metas/progreso` | Progreso de metas |

---

## 🧩 Modelos principales

| Modelo | Campos clave |
|---|---|
| `Usuario` | nombre, email, password, carrera, semestre |
| `Materia` | nombre, color, usuarioId |
| `Tarea` | titulo, descripcion, fechaMeta, fechaLimite, prioridad, estado |
| `Meta` | titulo, tipo, fechaInicio, fechaFin |

---

## 🎤 Flujo recomendado para demo

1. Iniciar backend.
2. Iniciar frontend.
3. Abrir `http://localhost:5173`.
4. Iniciar sesión con `carlos@demo.com / demo1234`.
5. Mostrar:
   - 📊 Dashboard con alertas y progreso.
   - ✅ Tareas filtrables.
   - 📝 Modal de crear/editar tareas.
   - 🗓️ Calendario mensual.
   - 🎯 Metas con progreso.

---

## 🚧 Estado del proyecto

MVP funcional para feria tecnológica.

Incluye:

- Autenticación.
- Dashboard.
- Gestión de tareas.
- Calendario.
- Metas.
- Progreso académico.
- Datos demo.
- Interfaz responsive.

---

## 🔮 Mejoras futuras

- 🔔 Notificaciones push.
- 📧 Recordatorios por correo.
- 📆 Sincronización con Google Calendar.
- 📈 Estadísticas avanzadas.
- 🗓️ Vista semanal.
- 👥 Roles de usuario.
- 📱 Versión móvil nativa.
- 🌐 PWA completa con modo offline.

---

## 👨‍💻 Autores

- **Reynaldo Dura Pertuz**
- **Ana Carolina Sierra**
- **Sergio Luis Sanchez Barrios**

---

## 📄 Licencia

Proyecto bajo licencia MIT.

---

<div align="center">

### PlanAhead: planifica mejor, reduce el estrés y cumple tus metas académicas.

</div>
