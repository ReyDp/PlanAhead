const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const testDbPath = path.resolve(process.cwd(), 'tests', 'test.db');
fs.mkdirSync(path.dirname(testDbPath), { recursive: true });
fs.closeSync(fs.openSync(testDbPath, 'a'));
process.env.DATABASE_URL = `file:${testDbPath.replace(/\\/g, '/')}`;

const prisma = new PrismaClient();

beforeAll(async () => {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
    stdio: 'inherit',
  });
});

beforeEach(async () => {
  await prisma.tarea.deleteMany();
  await prisma.meta.deleteMany();
  await prisma.materia.deleteMany();
  await prisma.usuario.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
