import COLORS from './colors';

/**
 * Tipos de moradia disponíveis para cadastro de família.
 */
export const TIPOS_MORADIA = [
  'Casa', 'Prédio', 'Estúdio', 'Kitnet', 'Apartamento',
  'Condomínio', 'Chácara', 'Sítio', 'Fazenda', 'República', 'Casa de Pensão',
];

/**
 * Tipos de visita domiciliar, com ícone e cor de destaque para botões.
 */
export const VISIT_TYPES = [
  { key: 'Rotina',      label: 'Rotina',      icon: 'calendar-outline', color: COLORS.primary      },
  { key: 'Busca Ativa', label: 'Busca Ativa', icon: 'search',           color: COLORS.visitPurple  },
  { key: 'Urgência',    label: 'Urgência',    icon: 'alert-circle',     color: COLORS.danger       },
];

/**
 * Cores de badge (fundo + texto) por tipo de visita, usadas em cards e listagens.
 */
export const VISIT_TYPE_COLORS = {
  'Rotina':      { bg: COLORS.lightBlue,        text: COLORS.primaryMid   },
  'Busca Ativa': { bg: COLORS.visitPurpleLight,  text: COLORS.visitPurple  },
  'Urgência':    { bg: COLORS.dangerLight,       text: COLORS.dangerDark   },
};
