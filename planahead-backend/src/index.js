require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const materiasRoutes = require('./routes/materias');
const tareasRoutes = require('./routes/tareas');
const dashboardRoutes = require('./routes/dashboard');
const calendarioRoutes = require('./routes/calendario');
const metasRoutes = require('./routes/metas');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calendario', calendarioRoutes);
app.use('/api/metas', metasRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({ error: message });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
  });
}

module.exports = app;
