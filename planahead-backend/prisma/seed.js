const { PrismaClient, Prioridad, EstadoTarea, TipoMeta } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'test@planahead.dev';
  const plainPassword = 'test1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {
      nombre: 'Usuario de Prueba',
      password: hashedPassword,
      carrera: 'Ingeniería en Sistemas',
      semestre: 6,
    },
    create: {
      nombre: 'Usuario de Prueba',
      email,
      password: hashedPassword,
      carrera: 'Ingeniería en Sistemas',
      semestre: 6,
    },
  });

  await prisma.tarea.deleteMany({ where: { usuarioId: usuario.id } });
  await prisma.meta.deleteMany({ where: { usuarioId: usuario.id } });
  await prisma.materia.deleteMany({ where: { usuarioId: usuario.id } });

  const materias = await prisma.$transaction([
    prisma.materia.create({
      data: { nombre: 'Matemáticas', color: '#EF4444', usuarioId: usuario.id },
    }),
    prisma.materia.create({
      data: { nombre: 'Programación', color: '#10B981', usuarioId: usuario.id },
    }),
    prisma.materia.create({
      data: { nombre: 'Historia', color: '#3B82F6', usuarioId: usuario.id },
    }),
  ]);

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  await prisma.tarea.createMany({
    data: [
      {
        titulo: 'Entrega crítica vencida',
        descripcion: 'Proyecto final sin entregar',
        fechaLimite: yesterday,
        fechaMeta: yesterday,
        prioridad: Prioridad.ALTA,
        estado: EstadoTarea.PENDIENTE,
        usuarioId: usuario.id,
        materiaId: materias[0].id,
      },
      {
        titulo: 'Preparar exposición',
        descripcion: 'Exposición alta prioridad para mañana',
        fechaLimite: tomorrow,
        fechaMeta: tomorrow,
        prioridad: Prioridad.ALTA,
        estado: EstadoTarea.EN_PROGRESO,
        usuarioId: usuario.id,
        materiaId: materias[1].id,
      },
      {
        titulo: 'Leer capítulo complementario',
        descripcion: 'Actividad de prioridad media',
        fechaLimite: nextWeek,
        fechaMeta: nextWeek,
        prioridad: Prioridad.MEDIA,
        estado: EstadoTarea.PENDIENTE,
        usuarioId: usuario.id,
        materiaId: materias[2].id,
      },
      {
        titulo: 'Ejercicios resueltos',
        descripcion: 'Tarea ya completada',
        fechaLimite: now,
        fechaMeta: now,
        prioridad: Prioridad.BAJA,
        estado: EstadoTarea.COMPLETADA,
        usuarioId: usuario.id,
        materiaId: materias[0].id,
      },
    ],
  });

  await prisma.meta.create({
    data: {
      titulo: 'Completar plan semanal de estudio',
      tipo: TipoMeta.SEMANAL,
      fechaInicio: now,
      fechaFin: nextWeek,
      usuarioId: usuario.id,
    },
  });

  console.log('Seed ejecutado con éxito.');
  console.log(`Credenciales: ${email} / ${plainPassword}`);
}

main()
  .catch((error) => {
    console.error('Error en seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });