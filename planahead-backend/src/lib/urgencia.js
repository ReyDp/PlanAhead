function diasEntre(fecha1, fecha2) {
  const diff = fecha2 - fecha1;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function calcularUrgencia(fechaMeta, fechaBase = new Date()) {
  const diasAMeta = diasEntre(fechaBase, new Date(fechaMeta));

  if (diasAMeta < 0) {
    return 'CRITICA';
  }

  if (diasAMeta <= 1) {
    return 'ALTA';
  }

  if (diasAMeta <= 3) {
    return 'MEDIA';
  }

  return 'BAJA';
}

module.exports = {
  calcularUrgencia,
  diasEntre,
};
