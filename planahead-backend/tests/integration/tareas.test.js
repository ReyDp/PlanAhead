const request = require('supertest');
const app = require('../../src/index');
const { crearUsuarioTest, crearMateriaTest } = require('../helpers/auth.helper');

let token;
let usuarioId;
let materiaId;

beforeEach(async () => {
  const { usuario, token: tokenUsuario } = await crearUsuarioTest();
  token = tokenUsuario;
  usuarioId = usuario.id;
  const materia = await crearMateriaTest(usuarioId);
  materiaId = materia.id;
});

const enDias = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

describe('POST /api/tareas — validación de doble fecha', () => {
  test('crea tarea cuando fechaMeta es anterior a fechaLimite', async () => {
    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarea válida',
        fechaMeta: enDias(2),
        fechaLimite: enDias(5),
        materiaId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('retorna 400 cuando fechaMeta es igual a fechaLimite', async () => {
    const fecha = enDias(3);
    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarea inválida',
        fechaMeta: fecha,
        fechaLimite: fecha,
        materiaId,
      });

    expect(res.status).toBe(400);
  });

  test('retorna 400 cuando fechaMeta es posterior a fechaLimite', async () => {
    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarea inválida',
        fechaMeta: enDias(5),
        fechaLimite: enDias(2),
        materiaId,
      });

    expect(res.status).toBe(400);
  });

  test('retorna 400 si falta el título', async () => {
    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({ fechaMeta: enDias(2), fechaLimite: enDias(5), materiaId });

    expect(res.status).toBe(400);
  });

  test('retorna 400 si la materia pertenece a otro usuario', async () => {
    const { usuario: otro } = await crearUsuarioTest();
    const materiaAjena = await crearMateriaTest(otro.id);

    const res = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Intento de acceso cruzado',
        fechaMeta: enDias(2),
        fechaLimite: enDias(5),
        materiaId: materiaAjena.id,
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/tareas — ownership', () => {
  test('solo retorna las tareas del usuario autenticado', async () => {
    await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Mi tarea', fechaMeta: enDias(2), fechaLimite: enDias(5), materiaId });

    const { usuario: otro, token: tokenOtro } = await crearUsuarioTest();
    const materiaOtro = await crearMateriaTest(otro.id);
    await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${tokenOtro}`)
      .send({
        titulo: 'Tarea ajena',
        fechaMeta: enDias(2),
        fechaLimite: enDias(5),
        materiaId: materiaOtro.id,
      });

    const res = await request(app)
      .get('/api/tareas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toBe('Mi tarea');
  });
});

describe('PUT /api/tareas/:id', () => {
  test('actualiza una tarea propia correctamente', async () => {
    const crear = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Original', fechaMeta: enDias(2), fechaLimite: enDias(5), materiaId });

    const res = await request(app)
      .put(`/api/tareas/${crear.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Actualizada' });

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Actualizada');
  });

  test('retorna 403 al intentar editar tarea ajena', async () => {
    const { token: tokenOtro, usuario: otro } = await crearUsuarioTest();
    const materiaOtro = await crearMateriaTest(otro.id);
    const tareaAjena = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${tokenOtro}`)
      .send({ titulo: 'Ajena', fechaMeta: enDias(2), fechaLimite: enDias(5), materiaId: materiaOtro.id });

    const res = await request(app)
      .put(`/api/tareas/${tareaAjena.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Intento de modificación' });

    expect(res.status).toBe(403);
  });
});
