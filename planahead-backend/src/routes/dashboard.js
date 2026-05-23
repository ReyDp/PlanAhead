const express = require('express');
const prisma = require('../lib/prisma');
const { calcularUrgencia, diasEntre } = require('../lib/urgencia');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const ORDEN_URGENCIA = { CRITICA: 0, ALTA: 1, MEDIA: 2, BAJA: 3 };

router.use(verifyToken);

function selectMateria() {
  return {
    materia: {
      select: {
        nombre: true,
        color: true,
      },
    },
  };
}

router.get('/', async (req, res, next) => {
  try {
    const usuarioId = req.user.id;
    const fechaHoy = new Date();

    const [usuario, tareasPendientes, tareasUsuario] = await Promise.all([
      prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { nombre: true },
      }),
      prisma.tarea.findMany({
        where: {
          usuarioId,
          estado: { not: 'COMPLETADA' },
        },
        include: selectMateria(),
        orderBy: { fechaMeta: 'asc' },
      }),
      prisma.tarea.findMany({
        where: { usuarioId },
        include: {
          materia: {
            select: {
              id: true,
              nombre: true,
              color: true,
            },
          },
        },
      }),
    ]);

    const tareasConUrgencia = tareasPendientes.map((tarea) => {
      const diasAMeta = diasEntre(fechaHoy, tarea.fechaMeta);
      const diasALimite = diasEntre(fechaHoy, tarea.fechaLimite);
      const urgencia = calcularUrgencia(tarea.fechaMeta, fechaHoy);

      return {
        ...tarea,
        urgencia,
        diasAMeta,
        diasALimite,
      };
    });

    const alertas = tareasConUrgencia
      .filter((tarea) => tarea.urgencia === 'CRITICA' || tarea.urgencia === 'ALTA')
      .map((tarea) => ({
        id: tarea.id,
        titulo: tarea.titulo,
        urgencia: tarea.urgencia,
        diasAMeta: tarea.diasAMeta,
        fechaMeta: tarea.fechaMeta,
        fechaLimite: tarea.fechaLimite,
        materia: tarea.materia,
      }));

    const tareasDelDia = tareasConUrgencia
      .map((tarea) => ({
        id: tarea.id,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        estado: tarea.estado,
        prioridad: tarea.prioridad,
        urgencia: tarea.urgencia,
        diasAMeta: tarea.diasAMeta,
        diasALimite: tarea.diasALimite,
        fechaMeta: tarea.fechaMeta,
        fechaLimite: tarea.fechaLimite,
        materia: tarea.materia,
      }))
      .sort((a, b) => ORDEN_URGENCIA[a.urgencia] - ORDEN_URGENCIA[b.urgencia]);

    const progresoPorMateria = tareasUsuario.reduce((acumulado, tarea) => {
      const materiaId = tarea.materia.id;

      if (!acumulado.has(materiaId)) {
        acumulado.set(materiaId, {
          materiaId,
          nombre: tarea.materia.nombre,
          color: tarea.materia.color,
          total: 0,
          completadas: 0,
        });
      }

      const progreso = acumulado.get(materiaId);
      progreso.total += 1;

      if (tarea.estado === 'COMPLETADA') {
        progreso.completadas += 1;
      }

      return acumulado;
    }, new Map());

    const progreso = Array.from(progresoPorMateria.values()).map((materia) => ({
      ...materia,
      porcentaje: Math.round((materia.completadas / materia.total) * 100),
    }));

    return res.status(200).json({
      usuario: {
        nombre: usuario ? usuario.nombre : null,
      },
      fechaHoy: fechaHoy.toISOString(),
      resumen: {
        totalPendientes: tareasPendientes.length,
        totalCriticas: tareasConUrgencia.filter((tarea) => tarea.urgencia === 'CRITICA').length,
        totalAltas: tareasConUrgencia.filter((tarea) => tarea.urgencia === 'ALTA').length,
      },
      alertas,
      tareasDelDia,
      progreso,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
