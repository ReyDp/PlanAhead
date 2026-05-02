# 🚀 **[PLANAHEAD]**

> Aplicación web progresiva (PWA) para la gestión académica con planificación anticipada, metas y alertas inteligentes.

---

## 📌 **Descripción**

**[PLANAHEAD]** es una plataforma diseñada para estudiantes universitarios que permite organizar tareas, exámenes y actividades académicas en un solo lugar.

A diferencia de una agenda tradicional, el sistema introduce el concepto de **planificación anticipada**, permitiendo definir no solo una fecha límite, sino también una **fecha meta personal**, ayudando a evitar retrasos y mejorar la productividad.

---

## 🎯 **Objetivo**

Facilitar la organización académica mediante herramientas que promuevan:

* Planificación efectiva del tiempo
* Cumplimiento de tareas antes de su fecha límite
* Visualización clara de prioridades
* Seguimiento del progreso académico

---

## 🧠 **Características principales**

* 📌 Gestión de tareas con doble fecha:

  * Fecha límite (oficial)
  * Fecha meta (personal)

* 🔔 Alertas inteligentes:

  * Identificación de tareas críticas
  * Recordatorios basados en proximidad de fechas

* 📊 Dashboard académico:

  * Resumen del día
  * Tareas prioritarias
  * Estado general del usuario

* 📅 Calendario:

  * Visualización mensual de actividades

* 📈 Progreso académico:

  * Seguimiento por materias
  * Tareas completadas vs pendientes

---

## 🏗️ **Arquitectura del sistema**

```text
Frontend (React PWA)
        │
        ▼
Backend (Node.js + Express)
        │
        ▼
Base de datos (SQLite + Prisma ORM)
```

---

## ⚙️ **Tecnologías utilizadas**

### Frontend

* React
* HTML5 / CSS3
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js

### Base de datos

* SQLite
* Prisma ORM

### Otros

* JWT (autenticación)
* PWA (manifest + service worker)

---

## 📂 **Estructura del proyecto**

```bash
project/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── app.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🚀 **Instalación y ejecución**

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configura las variables de entorno en `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu_secreto"
```

---

### 3. Base de datos

```bash
npx prisma migrate dev
npx prisma db seed
```

---

### 4. Ejecutar servidor

```bash
npm run dev
```

---

### 5. Frontend

```bash
cd ../frontend
npm install
npm start
```

---

## 🔐 **Autenticación**

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

* Login con email y contraseña
* Token almacenado en el cliente
* Validación en cada request protegido

---

## 📡 **API principal**

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Tareas

* `GET /api/tareas`
* `POST /api/tareas`
* `PUT /api/tareas/:id`
* `DELETE /api/tareas/:id`

### Dashboard

* `GET /api/dashboard`

---

## 📊 **Ejemplo de respuesta del dashboard**

```json
{
  "alertas": [],
  "tareas": {
    "criticas": [],
    "alta": [],
    "media": [],
    "baja": []
  },
  "progreso": []
}
```

---

## 🧪 **Datos de prueba**

Al ejecutar el seed se crea:

* Usuario demo
* Tareas con distintos niveles de urgencia

Esto permite visualizar el dashboard inmediatamente.

---

## 📈 **Estado del proyecto**

🚧 En desarrollo — MVP enfocado en:

* Gestión de tareas
* Alertas inteligentes
* Dashboard funcional

---

## 🔮 **Mejoras futuras**

* Aplicación móvil nativa
* Notificaciones push
* Asistente académico
* Estadísticas avanzadas
* Integración con calendarios externos

---

## 👨‍💻 **Autor**

Desarrollado por: **[REYNALDO DURA PERTUZ]**

---

## 📄 **Licencia**

Este proyecto está bajo la licencia MIT.

---

## ⭐ **Notas finales**

Este proyecto no busca ser solo una agenda digital, sino una herramienta que ayude a los estudiantes a:

> **planificar mejor, reducir el estrés y mejorar su rendimiento académico.**

---
