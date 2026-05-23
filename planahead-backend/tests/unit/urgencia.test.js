const { calcularUrgencia } = require('../../src/lib/urgencia');

describe('calcularUrgencia', () => {
  test('retorna CRITICA cuando fechaMeta ya pasó', () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    expect(calcularUrgencia(ayer)).toBe('CRITICA');
  });

  test('retorna ALTA cuando fechaMeta es hoy', () => {
    const hoy = new Date();
    expect(calcularUrgencia(hoy)).toBe('ALTA');
  });

  test('retorna ALTA cuando faltan exactamente 1 día', () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    expect(calcularUrgencia(manana)).toBe('ALTA');
  });

  test('retorna MEDIA cuando faltan 2 días', () => {
    const dosDias = new Date();
    dosDias.setDate(dosDias.getDate() + 2);
    expect(calcularUrgencia(dosDias)).toBe('MEDIA');
  });

  test('retorna MEDIA cuando faltan 3 días', () => {
    const tresDias = new Date();
    tresDias.setDate(tresDias.getDate() + 3);
    expect(calcularUrgencia(tresDias)).toBe('MEDIA');
  });

  test('retorna BAJA cuando faltan más de 3 días', () => {
    const unaSemana = new Date();
    unaSemana.setDate(unaSemana.getDate() + 7);
    expect(calcularUrgencia(unaSemana)).toBe('BAJA');
  });
});
