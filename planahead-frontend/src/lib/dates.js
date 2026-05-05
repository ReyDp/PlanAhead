export function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().split('T')[0];
}

export function formatDate(value) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function diasEntre(fecha1, fecha2) {
  const diff = fecha2 - fecha1;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calcularUrgencia(fechaMeta) {
  const diasAMeta = diasEntre(new Date(), new Date(fechaMeta));

  if (diasAMeta < 0) {
    return { urgencia: 'CRITICA', diasAMeta };
  }

  if (diasAMeta <= 1) {
    return { urgencia: 'ALTA', diasAMeta };
  }

  if (diasAMeta <= 3) {
    return { urgencia: 'MEDIA', diasAMeta };
  }

  return { urgencia: 'BAJA', diasAMeta };
}
