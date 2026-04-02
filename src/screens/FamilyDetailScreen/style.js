import { StyleSheet, Platform, StatusBar } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    // Adicionado para evitar que o header cole no topo do Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  header: {
    backgroundColor: COLORS.primary,
    // Ajustado para manter consistência com o StatusBar
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },

  // Family Info Card
  familyInfoCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  familyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  familyName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  familyAddress: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 6,
  },
  familyMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  metaItem: {},
  metaLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
  },
  metaValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },

  // List
  listContainer: {
    padding: 14,
    // Aumentado para o conteúdo não ficar sob o FAB ou os botões do Android
    paddingBottom: Platform.OS === 'android' ? 120 : 100,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.8,
  },

  // Member Card
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberAge: {
    fontSize: 12,
    color: COLORS.grey,
  },
  gestanteTag: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '600',
    marginLeft: 6,
  },
  memberTags: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
  },
  conditionTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  conditionTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  memberActions: {
    gap: 4,
  },
  memberActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.greyDark,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.grey,
    marginTop: 4,
  },

  // Visits section header
  visitsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 4,
  },
  novaVisitaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  novaVisitaBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  // Visit Card
  visitCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  visitCardLeft: {
    flex: 1,
    gap: 4,
  },
  visitTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  visitTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  visitPaciente: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  visitMotivo: {
    fontSize: 13,
    color: '#6B7280',
  },
  visitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  visitMetaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  visitMetaDot: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  visitDeleteBtn: {
    padding: 4,
    marginLeft: 8,
  },

  // FAB (Botão flutuante de adicionar membro)
  fab: {
    position: 'absolute',
    right: 20,
    // Aumentado o bottom para não colidir com a Tab Bar no Android
    bottom: Platform.OS === 'android' ? 30 : 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Modal compartilhado
  modalContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalHeaderSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 2,
  },

  // Form
  formContainer: {
    padding: 20,
    // Espaçamento extra no fim do formulário
    paddingBottom: Platform.OS === 'android' ? 60 : 40,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A202C',
    marginBottom: 4,
  },

  // Toggle (sexo / gestante)
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  toggleBtnActiveM: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  toggleBtnActiveF: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.greyDark,
  },
  toggleBtnTextActive: {
    color: '#fff',
  },

  // Condições
  conditionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  conditionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  conditionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.greyDark,
  },

  // Save Button
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
    // Margem inferior maior para não ficar colado no fim da tela
    marginBottom: Platform.OS === 'android' ? 40 : 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // Visitas Modal Específicos
  visitTipoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  visitTipoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  visitTipoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.greyDark,
  },
  visitMembroRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
    marginBottom: 4,
  },
  visitMembroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}12`,
  },
  visitMembroChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  visitMembroChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  visitVitaisRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
});