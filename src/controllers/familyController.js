import {
  createFamily as serviceCreate,
  getFamilies as serviceGetFamilies,
  updateFamily as serviceUpdate,
  deleteFamily as serviceDelete
} from "../services/familyService";

async function createFamily(data, uid) {
  try {
    return await serviceCreate(data, uid);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao cadastrar família.');
    err.code = error.code;
    throw err;
  }
}

async function getFamilies(uid) {
  try {
    return await serviceGetFamilies(uid);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao buscar famílias.');
    err.code = error.code;
    throw err;
  }
}

async function updateFamily(id, data) {
  try {
    return await serviceUpdate(id, data);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao atualizar família.');
    err.code = error.code;
    throw err;
  }
}

async function deleteFamily(id) {
  try {
    return await serviceDelete(id);
  } catch (error) {
    const err = new Error(error.message || 'Erro ao excluir família.');
    err.code = error.code;
    throw err;
  }
}

export { createFamily, getFamilies, updateFamily, deleteFamily };
