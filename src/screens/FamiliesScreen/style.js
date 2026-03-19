import { StyleSheet, Platform } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
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
    paddingBottom: 100,
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