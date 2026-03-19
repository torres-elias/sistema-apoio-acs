
import { StyleSheet, Platform } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
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
    paddingBottom: 100,
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

  // Condition Tags
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

  // Member Actions
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

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
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
    paddingBottom: 40,
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
  },

  // Toggle Buttons
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

  // Conditions
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

  // Save
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 28,
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

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
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
});