const express = require('express');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

const ESTADOS_VALIDOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
const PRIORIDADES_VALIDAS = ['ALTA', 'MEDIA', 'BAJA'];

router.use(verifyToken);

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function materiaPerteneceAlUsuario(materiaId, usuarioId) {
  const materia = await prisma.materia.findFirst({
    where: {
      id: materiaId,
      usuarioId,
    },
  });

  return Boolean(materia);
}

function includeMateria() {
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
    const { estado, materiaId } = req.query;
    const where = { usuarioId: req.user.id };

    if (estado) {
      if (!ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ error: 'estado inválido' });
      }

      where.estado = estado;
    }

    if (materiaId) {
      const materiaIdNumber = parseId(materiaId);

      if (!materiaIdNumber) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }

      where.materiaId = materiaIdNumber;
    }

    const tareas = await prisma.tarea.findMany({
      where,
      include: includeMateria(),
      orderBy: { fechaMeta: 'asc' },
    });

    return res.status(200).json(tareas);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { titulo, descripcion, fechaLimite, fechaMeta, prioridad, materiaId } = req.body;

    if (!titulo || !fechaLimite || !fechaMeta || !materiaId) {
      return res.status(400).json({
        error: 'titulo, fechaLimite, fechaMeta y materiaId son requeridos',
      });
    }

    const materiaIdNumber = parseId(materiaId);
    const fechaLimiteDate = parseDate(fechaLimite);
    const fechaMetaDate = parseDate(fechaMeta);

    if (!materiaIdNumber || !fechaLimiteDate || !fechaMetaDate) {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    if (fechaMetaDate >= fechaLimiteDate) {
      return res.status(400).json({ error: 'fechaMeta debe ser anterior a fechaLimite' });
    }

    if (prioridad && !PRIORIDADES_VALIDAS.includes(prioridad)) {
      return res.status(400).json({ error: 'prioridad inválida' });
    }

    const materiaValida = await materiaPerteneceAlUsuario(materiaIdNumber, req.user.id);

    if (!materiaValida) {
      return res.status(400).json({ error: 'La materia debe pertenecer al usuario autenticado' });
    }

    const tarea = await prisma.tarea.create({
      data: {
        titulo,
        descripcion,
        fechaLimite: fechaLimiteDate,
        fechaMeta: fechaMetaDate,
        prioridad: prioridad || 'MEDIA',
        materiaId: materiaIdNumber,
        usuarioId: req.user.id,
      },
      include: includeMateria(),
    });

    return res.status(201).json(tarea);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const tareaId = parseId(req.params.id);

    if (!tareaId) {
      return res.status(400).json({ error: 'id inválido' });
    }

    const tareaExistente = await prisma.tarea.findUnique({
      where: { id: tareaId },
    });

    if (!tareaExistente || tareaExistente.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const {
      titulo,
      descripcion,
      fechaLimite,
      fechaMeta,
      prioridad,
      estado,
      materiaId,
    } = req.body;

    const data = {};

    if (titulo !== undefined) {
      data.titulo = titulo;
    }

    if (descripcion !== undefined) {
      data.descripcion = descripcion;
    }

    if (prioridad !== undefined) {
      if (!PRIORIDADES_VALIDAS.includes(prioridad)) {
        return res.status(400).json({ error: 'prioridad inválida' });
      }

      data.prioridad = prioridad;
    }

    if (estado !== undefined) {
      if (!ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({ error: 'estado inválido' });
      }

      data.estado = estado;
    }

    if (materiaId !== undefined) {
      const materiaIdNumber = parseId(materiaId);

      if (!materiaIdNumber) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }

      const materiaValida = await materiaPerteneceAlUsuario(materiaIdNumber, req.user.id);

      if (!materiaValida) {
        return res.status(400).json({ error: 'La materia debe pertenecer al usuario autenticado' });
      }

      data.materiaId = materiaIdNumber;
    }

    const metaFinal = fechaMeta ? new Date(fechaMeta) : tareaExistente.fechaMeta;
    const limiteFinal = fechaLimite ? new Date(fechaLimite) : tareaExistente.fechaLimite;

    if (Number.isNaN(metaFinal.getTime()) || Number.isNaN(limiteFinal.getTime())) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    if (metaFinal >= limiteFinal) {
      return res.status(400).json({ error: 'fechaMeta debe ser anterior a fechaLimite' });
    }

    if (fechaMeta !== undefined) {
      data.fechaMeta = metaFinal;
    }

    if (fechaLimite !== undefined) {
      data.fechaLimite = limiteFinal;
    }

    const tarea = await prisma.tarea.update({
      where: { id: tareaId },
      data,
      include: includeMateria(),
    });

    return res.status(200).json(tarea);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const tareaId = parseId(req.params.id);

    if (!tareaId) {
      return res.status(400).json({ error: 'id inválido' });
    }

    const tareaExistente = await prisma.tarea.findUnique({
      where: { id: tareaId },
    });

    if (!tareaExistente || tareaExistente.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await prisma.tarea.delete({
      where: { id: tareaId },
    });

    return res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
