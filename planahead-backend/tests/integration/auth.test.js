const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../src/index');
const { crearUsuarioTest } = require('../helpers/auth.helper');

describe('POST /api/auth/register', () => {
  test('registra un usuario con datos válidos y retorna token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana García', email: 'ana@test.com', password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('usuario');
    expect(res.body.usuario).not.toHaveProperty('password');
  });

  test('retorna 400 si falta el email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', password: '123456' });

    expect(res.status).toBe(400);
  });

  test('retorna 400 si falta la contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'ana@test.com' });

    expect(res.status).toBe(400);
  });

  test('retorna 409 si el email ya está registrado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Ana', email: 'duplicado@test.com', password: '123456' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Otro', email: 'duplicado@test.com', password: 'abcdef' });

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test User', email: 'login@test.com', password: 'pass123' });
  });

  test('hace login con credenciales correctas y retorna token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'pass123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('retorna 401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  test('retorna 401 con email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@test.com', password: 'pass123' });

    expect(res.status).toBe(401);
  });

  test('el token del login es verificable con JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'pass123' });

    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload).toHaveProperty('id');
    expect(payload.email).toBe('login@test.com');
  });
});

describe('verifyToken middleware', () => {
  test('retorna 401 si no hay token en el header', async () => {
    const res = await request(app).get('/api/tareas');

    expect(res.status).toBe(401);
  });

  test('retorna 401 si el token es inválido', async () => {
    const res = await request(app)
      .get('/api/tareas')
      .set('Authorization', 'Bearer token_falso_invalido');

    expect(res.status).toBe(401);
  });

  test('permite acceso con token válido', async () => {
    const { token } = await crearUsuarioTest();
    const res = await request(app)
      .get('/api/tareas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
