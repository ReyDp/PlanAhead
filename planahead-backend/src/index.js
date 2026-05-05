require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const materiasRoutes = require('./routes/materias');
const tareasRoutes = require('./routes/tareas');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({ error: message });
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
  });
}

module.exports = app;
