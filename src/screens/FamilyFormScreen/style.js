import { StyleSheet, Platform } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.pageBackground,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.pageBackground,
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
    color: COLORS.surface,
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
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  formInputDisabled: {
    backgroundColor: COLORS.inputBackground,
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
    backgroundColor: COLORS.surface,
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
    color: COLORS.surface,
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
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
