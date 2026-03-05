const errorMessages = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/invalid-credential': 'Email ou senha inválidos.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
};

export function translateError(code) {
  return errorMessages[code] || 'Ocorreu um erro. Tente novamente.';
}