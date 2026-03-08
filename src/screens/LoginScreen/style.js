import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginTop: -20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 8,
    letterSpacing: 0.8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: COLORS.grey,
  },

  inputIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 15,
    color: COLORS.greyDark,
  },

  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  version: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 32,
  },
});

export default styles;