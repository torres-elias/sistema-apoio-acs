import { StyleSheet, Platform } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 10,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    marginTop: 2,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  // Section Title
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.8,
  },

  // Quick Access
  quickAccessRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A202C',
  },
  quickCardSub: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 2,
  },

  // Profile
  profileBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  profileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1A202C',
    fontWeight: '500',
  },
  profileBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 36,
    alignItems: 'center',
  },
  profileBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default styles;