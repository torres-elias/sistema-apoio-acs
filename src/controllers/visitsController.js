import * as visitService from '../services/visitsService';

async function createVisit(data, acsUid) {
  if (!data.motivo || !data.tipoVisita) {
    throw new Error('Tipo de visita e motivo são obrigatórios.');
  }
  return await visitService.createVisit(data, acsUid);
}

async function getVisitsByFamily(familyId, acsUid) {
  const visits = await visitService.getVisitsByFamily(familyId, acsUid);
  // Ordena pela data mais recente
  return visits.sort((a, b) => {
    const toMs = (d) => {
      if (!d) return 0;
      const [dd, mm, yyyy] = d.split('/');
      return new Date(`${yyyy}-${mm}-${dd}`).getTime();
    };
    return toMs(b.dataVisita) - toMs(a.dataVisita);
  });
}

async function getVisitsByAcs(acsUid) {
  const visits = await visitService.getVisitsByAcs(acsUid);
  return visits.sort((a, b) => {
    const toMs = (d) => {
      if (!d) return 0;
      const [dd, mm, yyyy] = d.split('/');
      return new Date(`${yyyy}-${mm}-${dd}`).getTime();
    };
    return toMs(b.dataVisita) - toMs(a.dataVisita);
  });
}

async function updateVisit(id, data) {
  return await visitService.updateVisit(id, data);
}

async function deleteVisit(id) {
  return await visitService.deleteVisit(id);
}

export { createVisit, getVisitsByFamily, getVisitsByAcs, updateVisit, deleteVisit };
