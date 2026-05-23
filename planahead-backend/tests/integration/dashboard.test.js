const request = require('supertest');
const app = require('../../src/index');
const { crearUsuarioTest, crearMateriaTest } = require('../helpers/auth.helper');

const enDias = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

describe('GET /api/dashboard', () => {
  test('retorna estructura completa del dashboard', async () => {
    const { token } = await crearUsuarioTest();
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('alertas');
    expect(res.body).toHaveProperty('tareasDelDia');
    expect(res.body).toHaveProperty('progreso');
    expect(res.body).toHaveProperty('resumen');
    expect(Array.isArray(res.body.alertas)).toBe(true);
  });

  test('incluye en alertas las tareas con meta vencida (CRITICA)', async () => {
    const { token, usuario } = await crearUsuarioTest();
    const materia = await crearMateriaTest(usuario.id);

    await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Tarea crítica',
        fechaMeta: enDias(-2),
        fechaLimite: enDias(3),
        materiaId: materia.id,
      });

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.alertas.length).toBeGreaterThan(0);
    expect(res.body.alertas[0].urgencia).toBe('CRITICA');
  });

  test('NO incluye tareas completadas en alertas', async () => {
    const { token, usuario } = await crearUsuarioTest();
    const materia = await crearMateriaTest(usuario.id);

    const crear = await request(app)
      .post('/api/tareas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Ya completada',
        fechaMeta: enDias(-1),
        fechaLimite: enDias(2),
        materiaId: materia.id,
      });

    await request(app)
      .put(`/api/tareas/${crear.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'COMPLETADA' });

    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    const ids = res.body.alertas.map((alerta) => alerta.id);
    expect(ids).not.toContain(crear.body.id);
  });

  test('dashboard vacío es válido para usuario nuevo', async () => {
    const { token } = await crearUsuarioTest();
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.alertas).toHaveLength(0);
    expect(res.body.tareasDelDia).toHaveLength(0);
  });
});
