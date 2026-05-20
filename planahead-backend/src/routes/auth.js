const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

router.post('/register', async (req, res, next) => {
  try {
    const nombre = req.body.nombre ? req.body.nombre.trim() : '';
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password || '';
    const carrera = req.body.carrera ? req.body.carrera.trim() : undefined;
    const semestre = req.body.semestre;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Ingresa un email valido' });
    }

    if (!password) {
      return res.status(400).json({ error: 'El password es requerido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'El password debe tener al menos 6 caracteres' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        carrera,
        semestre,
      },
    });

    const token = signToken(usuario);

    return res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, usuario.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signToken(usuario);

    return res.status(200).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
