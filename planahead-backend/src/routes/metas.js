const express = require('express');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const TIPOS_VALIDOS = ['DIARIA', 'SEMANAL', 'PERSONALIZADA'];

router.use(verifyToken);

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

router.get('/progreso', async (req, res, next) => {
  try {
    const metas = await prisma.meta.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { fechaFin: 'asc' },
    });

    const metasConProgreso = await Promise.all(
      metas.map(async (meta) => {
        const [total, completadas] = await Promise.all([
          prisma.tarea.count({
            where: {
              usuarioId: req.user.id,
              creadoEn: {
                gte: meta.fechaInicio,
                lte: meta.fechaFin,
              },
            },
          }),
          prisma.tarea.count({
            where: {
              usuarioId: req.user.id,
              estado: 'COMPLETADA',
              creadoEn: {
                gte: meta.fechaInicio,
                lte: meta.fechaFin,
              },
            },
          }),
        ]);

        return {
          id: meta.id,
          titulo: meta.titulo,
          tipo: meta.tipo,
          fechaInicio: meta.fechaInicio,
          fechaFin: meta.fechaFin,
          progreso: {
            total,
            completadas,
            porcentaje: total > 0 ? Math.round((completadas / total) * 100) : 0,
          },
        };
      })
    );

    return res.status(200).json(metasConProgreso);
  } catch (error) {
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const metas = await prisma.meta.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { fechaFin: 'asc' },
    });

    return res.status(200).json(metas);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { titulo, tipo, fechaInicio, fechaFin } = req.body;

    if (!titulo || !tipo || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'titulo, tipo, fechaInicio y fechaFin son requeridos' });
    }

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ error: 'tipo invalido' });
    }

    const fechaInicioDate = parseDate(fechaInicio);
    const fechaFinDate = parseDate(fechaFin);

    if (!fechaInicioDate || !fechaFinDate) {
      return res.status(400).json({ error: 'Fechas invalidas' });
    }

    if (fechaFinDate <= fechaInicioDate) {
      return res.status(400).json({ error: 'fechaFin debe ser posterior a fechaInicio' });
    }

    const meta = await prisma.meta.create({
      data: {
        titulo,
        tipo,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
        usuarioId: req.user.id,
      },
    });

    return res.status(201).json(meta);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
