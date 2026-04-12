import * as unitService from '../services/unitService';

async function createUnit(data) {
  try {
    if (!data.nome || !data.municipio) {
      throw new Error('Nome e município são obrigatórios.');
    }
    return await unitService.createUnit(data);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao cadastrar unidade.');
    throw err;
  }
}

async function getUnits() {
  try {
    return await unitService.getUnits();
  } catch (error) {
    const err = new Error(error.message || 'Erro ao buscar unidades.');
    throw err;
  }
}

async function deleteUnit(id) {
  try {
    return await unitService.deleteUnit(id);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao excluir unidade.');
    throw err;
  }
}

export { createUnit, getUnits, deleteUnit };
