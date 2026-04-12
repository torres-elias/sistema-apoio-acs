const COLORS = {
  // Brand
  primary: '#1565C0',
  primaryLight: '#42A5F5',
  primaryDark: '#0D47A1',
  primaryMid: '#2563EB',       // badge text (ex: visita Rotina)

  // Surfaces & backgrounds
  surface: '#ffffff',          // cards, inputs, icon color on dark bg
  white: '#f5f5ff',            // legacy off-white
  background: '#f4f4f4',       // default app bg (VisitsScreen)
  pageBackground: '#F0F4F8',   // main screen background
  sectionBackground: '#F8FAFC',// list item action buttons
  inputBackground: '#F1F5F9',  // form inputs / dividers
  card: '#ebebeb',

  // Text
  text: '#1f2937',
  textLight: '#6B7280',

  // Borders & separators
  border: '#E5E7EB',
  grey: '#A0AEC0',
  greyDark: '#64748B',

  // Semantic
  danger: '#EF4444',
  dangerDark: '#DC2626',       // darker danger — Urgência badge, condition tags
  dangerLight: '#FEE2E2',      // tint — Urgência badge bg, hipertensão tag bg
  warning: '#F59E0B',
  warningDark: '#D97706',      // darker warning — diabetes tag text
  warningLight: '#FEF3C7',     // tint — diabetes tag bg
  success: '#10B981',

  // Gender indicators
  male: '#3B82F6',
  lightBlue: '#EFF6FF',        // male avatar bg / Rotina badge bg
  female: '#EC4899',
  lightPink: '#FDF2F8',        // female avatar bg

  // Visit types
  visitPurple: '#7C3AED',      // Busca Ativa
  visitPurpleLight: '#F3E8FF', // Busca Ativa badge bg

  // FAB
  fab: '#00C853',

  // VisitsScreen legacy (candidato a unificar com primary)
  accentBlue: '#2f80c1',
  accentBlueLight: '#e8f4fd',  // fundo do card de busca
};

export default COLORS;
