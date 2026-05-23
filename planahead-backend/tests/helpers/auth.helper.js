const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../src/lib/prisma');

async function crearUsuarioTest(overrides = {}) {
  const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const datos = {
    nombre: 'Usuario Test',
    email: `test_${unique}@test.com`,
    password: await bcrypt.hash('password123', 10),
    carrera: 'Ingeniería de Software',
    semestre: 5,
    ...overrides,
  };

  const usuario = await prisma.usuario.create({ data: datos });
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { usuario, token };
}

function crearMateriaTest(usuarioId, overrides = {}) {
  return prisma.materia.create({
    data: {
      nombre: 'Materia Test',
      color: '#1A56DB',
      usuarioId,
      ...overrides,
    },
  });
}

module.exports = {
  crearUsuarioTest,
  crearMateriaTest,
};
