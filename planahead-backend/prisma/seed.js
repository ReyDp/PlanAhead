const { PrismaClient, Prioridad, EstadoTarea, TipoMeta } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function startOfWeek(date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

function endOfWeek(date) {
  return endOfDay(addDays(startOfWeek(date), 6));
}

async function main() {
  const now = new Date();
  const today = startOfDay(now);

  const hashedPassword = await bcrypt.hash('demo1234', 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: 'carlos@demo.com' },
    update: {
      nombre: 'Carlos Mendoza',
      password: hashedPassword,
      carrera: 'Ingeniería de Sistemas',
      semestre: 6,
    },
    create: {
      nombre: 'Carlos Mendoza',
      email: 'carlos@demo.com',
      password: hashedPassword,
      carrera: 'Ingeniería de Sistemas',
      semestre: 6,
    },
  });

  await prisma.tarea.deleteMany({ where: { usuarioId: usuario.id } });
  await prisma.meta.deleteMany({ where: { usuarioId: usuario.id } });
  await prisma.materia.deleteMany({ where: { usuarioId: usuario.id } });

  const materiasData = [
    { nombre: 'Bases de Datos', color: '#1A56DB' },
    { nombre: 'Cálculo Diferencial', color: '#E74694' },
    { nombre: 'Ingeniería de Software', color: '#0EA5E9' },
    { nombre: 'Redes de Computadores', color: '#7E3AF2' },
    { nombre: 'Estadística', color: '#057A55' },
  ];

  const materias = {};

  for (const materiaData of materiasData) {
    const materia = await prisma.materia.create({
      data: {
        ...materiaData,
        usuarioId: usuario.id,
      },
    });

    materias[materia.nombre] = materia;
  }

  const tareasData = [
    {
      titulo: 'Proyecto final BD — diagrama ER',
      materia: 'Bases de Datos',
      fechaMeta: addDays(today, -1),
      fechaLimite: addDays(today, 2),
      prioridad: Prioridad.ALTA,
      estado: EstadoTarea.EN_PROGRESO,
    },
    {
      titulo: 'Taller derivadas parciales',
      materia: 'Cálculo Diferencial',
      fechaMeta: addDays(today, -2),
      fechaLimite: addDays(today, 1),
      prioridad: Prioridad.ALTA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Diagrama de casos de uso — sistema de ventas',
      materia: 'Ingeniería de Software',
      fechaMeta: addDays(today, 1),
      fechaLimite: addDays(today, 4),
      prioridad: Prioridad.ALTA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Laboratorio — configuración de subredes',
      materia: 'Redes de Computadores',
      fechaMeta: addDays(today, 1),
      fechaLimite: addDays(today, 3),
      prioridad: Prioridad.MEDIA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Informe análisis de regresión',
      materia: 'Estadística',
      fechaMeta: addDays(today, 2),
      fechaLimite: addDays(today, 6),
      prioridad: Prioridad.MEDIA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Normalización hasta 3FN — ejercicios',
      materia: 'Bases de Datos',
      fechaMeta: addDays(today, 3),
      fechaLimite: addDays(today, 7),
      prioridad: Prioridad.MEDIA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Lectura IEEE — protocolo TCP/IP',
      materia: 'Redes de Computadores',
      fechaMeta: addDays(today, 4),
      fechaLimite: addDays(today, 9),
      prioridad: Prioridad.BAJA,
      estado: EstadoTarea.PENDIENTE,
    },
    {
      titulo: 'Quiz semana 4 — Álgebra relacional',
      materia: 'Bases de Datos',
      fechaMeta: addDays(today, -7),
      fechaLimite: addDays(today, -6),
      prioridad: Prioridad.BAJA,
      estado: EstadoTarea.COMPLETADA,
    },
    {
      titulo: 'Parcial 1 — Estadística descriptiva',
      materia: 'Estadística',
      fechaMeta: addDays(today, -5),
      fechaLimite: addDays(today, -4),
      prioridad: Prioridad.MEDIA,
      estado: EstadoTarea.COMPLETADA,
    },
  ];

  await prisma.tarea.createMany({
    data: tareasData.map((tarea) => ({
      titulo: tarea.titulo,
      fechaMeta: tarea.fechaMeta,
      fechaLimite: tarea.fechaLimite,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      usuarioId: usuario.id,
      materiaId: materias[tarea.materia].id,
    })),
  });

  await prisma.meta.createMany({
    data: [
      {
        titulo: 'Entregar todos los proyectos de la semana',
        tipo: TipoMeta.SEMANAL,
        fechaInicio: startOfWeek(today),
        fechaFin: endOfWeek(today),
        usuarioId: usuario.id,
      },
      {
        titulo: 'Avanzar informe de Ingeniería de Software',
        tipo: TipoMeta.DIARIA,
        fechaInicio: today,
        fechaFin: endOfDay(addDays(today, 1)),
        usuarioId: usuario.id,
      },
    ],
  });

  console.log('✅ Demo seed cargado — usuario: carlos@demo.com / demo1234');
}

main()
  .catch((error) => {
    console.error('Error cargando demo seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
