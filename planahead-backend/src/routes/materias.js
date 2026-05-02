const express = require('express');
const prisma = require('../lib/prisma');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const materias = await prisma.materia.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { tareas: true },
        },
      },
    });

    return res.status(200).json(materias);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre, color } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'nombre es requerido' });
    }

    const materia = await prisma.materia.create({
      data: {
        nombre,
        color: color || '#1A56DB',
        usuarioId: req.user.id,
      },
    });

    return res.status(201).json(materia);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
