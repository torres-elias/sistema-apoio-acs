import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingHorizontal: 14,
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
  },

  statBox: {
    width: '50%',
    padding: 15,
    borderWidth: 0.5,
    borderColor: '#e6e6e6',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.greyDark,
  },

  sectionTitle: {
    marginTop: 15,
    marginLeft: 15,
    fontWeight: 'bold',
    color: COLORS.greyDark,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },

  card: {
    width: '48%',
    backgroundColor: COLORS.card,
    margin: '1%',
    padding: 18,
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2,
  },

  cardText: {
    marginTop: 10,
    color: COLORS.text,
    textAlign: 'center',
  },

  profileBox: {
    backgroundColor: COLORS.white,
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  logoutButton: {
    backgroundColor: `${COLORS.white}22`,
    borderRadius: 8,
    padding: 6,
  },

  infoView: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },

  infoCard: {
    backgroundColor: `${COLORS.white}22`,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    margin: 8,
    minWidth: 90,
  },

  infoCardText: {
    textAlign: 'center',
    color: COLORS.white,
  },

  cardImage: {
    width: 50,
    height: 50,
  },

  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },

  profileCardNumber: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;