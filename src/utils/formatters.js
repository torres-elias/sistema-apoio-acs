/**
 * Formata input de data conforme o usuário digita, inserindo barras automaticamente.
 * @param {string} value - valor bruto do TextInput
 * @returns {string} no formato DD/MM/AAAA (parcial ou completo)
 */
export function formatDateInput(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

/**
 * Calcula a idade em anos a partir de uma data no formato DD/MM/AAAA.
 * @param {string} dateString - data no formato DD/MM/AAAA
 * @returns {number|null} idade em anos inteiros, ou null se a data for inválida
 */
export function calculateAge(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const birth = new Date(parts[2], parts[1] - 1, parts[0]);
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

/**
 * Retorna a data de hoje no formato DD/MM/AAAA.
 * @returns {string}
 */
export function todayString() {
  const today = new Date();
  const dd    = String(today.getDate()).padStart(2, '0');
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy  = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
