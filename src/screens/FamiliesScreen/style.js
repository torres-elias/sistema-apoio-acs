import { StyleSheet, Platform, StatusBar } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    // Adicionado para evitar que o header colida com o topo no Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    // Ajustado para manter a proporção com o StatusBar
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    marginLeft: 12,
    flex: 1,
  },
  headerCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#fff',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List
  listContainer: {
    padding: 12,
    // Aumentado para garantir que o último card não fique sob a Tab Bar ou botões do sistema
    paddingBottom: Platform.OS === 'android' ? 120 : 100,
  },

  // Family Card
  familyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardNumberBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
  },
  responsibleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.grey,
    flex: 1,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.primary}12`,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Card Actions
  cardActions: {
    marginLeft: 8,
    gap: 4,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
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

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    // Ajustado para não colidir com os botões de navegação do Android
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

  // ── Modal de Edição ──────────────────────────────────────────────
  modalContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    // Safe area no topo do modal para Android
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

  // Form
  formContainer: {
    padding: 20,
    // Garante que o final do formulário seja acessível
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
  formInputDisabled: {
    backgroundColor: '#F1F5F9',
  },
  formRow: {
    flexDirection: 'row',
  },
  formInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoScroll: {
    marginTop: 8,
    marginBottom: 16,
  },
  tipoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  tipoBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tipoBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  tipoBtnTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    // Margem inferior para o botão de salvar não colar no fim da tela
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
});