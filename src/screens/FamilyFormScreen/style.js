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
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
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

  // Tipo Moradia
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

  // Save Button
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
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