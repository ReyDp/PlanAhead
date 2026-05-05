const express = require('express');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

function parseMonth(value) {
  const mes = Number(value);
  return Number.isInteger(mes) && mes >= 1 && mes <= 12 ? mes : null;
}

function parseYear(value) {
  const anio = Number(value);
  return Number.isInteger(anio) && value.length === 4 ? anio : null;
}

router.get('/', async (req, res, next) => {
  try {
    const { mes: mesParam, anio: anioParam } = req.query;

    if (!mesParam || !anioParam) {
      return res.status(400).json({ error: 'mes y anio son requeridos' });
    }

    const mes = parseMonth(mesParam);
    const anio = parseYear(anioParam);

    if (!mes || !anio) {
      return res.status(400).json({ error: 'mes o anio invalidos' });
    }

    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 0, 23, 59, 59, 999);

    const tareas = await prisma.tarea.findMany({
      where: {
        usuarioId: req.user.id,
        OR: [
          { fechaMeta: { gte: inicio, lte: fin } },
          { fechaLimite: { gte: inicio, lte: fin } },
        ],
      },
      include: {
        materia: {
          select: {
            nombre: true,
            color: true,
          },
        },
      },
      orderBy: { fechaMeta: 'asc' },
    });

    const dias = tareas.reduce((acumulado, tarea) => {
      const clave = tarea.fechaMeta.toISOString().split('T')[0];

      if (!acumulado[clave]) {
        acumulado[clave] = [];
      }

      acumulado[clave].push({
        id: tarea.id,
        titulo: tarea.titulo,
        fechaMeta: tarea.fechaMeta,
        fechaLimite: tarea.fechaLimite,
        estado: tarea.estado,
        materia: tarea.materia,
      });

      return acumulado;
    }, {});

    return res.status(200).json({
      mes,
      anio,
      dias,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
