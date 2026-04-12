import { StyleSheet, Platform, StatusBar } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // Garante que o conteúdo não fique sob a barra de status no topo (Android)
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header Geral
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },

  // Busca
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },

  // Listagem de Famílias
  listContainer: {
    paddingHorizontal: 15,
    // Aumentado para garantir que a última família da lista não fique
    // escondida atrás dos botões de navegação do Android
    paddingBottom: Platform.OS === 'android' ? 120 : 100,
  },
  familyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 50,
    marginRight: 15,
  },
  responsibleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingLeft: 5,
  },
  iconBtn: {
    padding: 8,
  },

  // Modal / Tela de Registro de Visita
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerVisita: {
    backgroundColor: COLORS.accentBlue,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContentVisita: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButtonVisita: {
    marginRight: 16,
  },
  titleVisita: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  subtitleVisita: {
    fontSize: 14,
    color: COLORS.surface,
    opacity: 0.8,
    marginTop: 2,
  },
  scrollContentVisita: {
    padding: 20,
    // Espaçamento extra no fim do formulário para o botão de salvar
    // subir o suficiente para não ser bloqueado pelos botões do Android
    paddingBottom: Platform.OS === 'android' ? 60 : 40,
  },
  cardVisita: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputGroupVisita: {
    marginBottom: 20,
  },
  labelVisita: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.grey,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainerVisita: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 52,
  },
  inputInnerVisita: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  inputTextVisita: {
    fontSize: 15,
    color: COLORS.text,
  },

  // Radio Buttons (Sim/Não)
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  radioButtonActive: {
    borderColor: COLORS.accentBlue,
    backgroundColor: COLORS.accentBlue + '15',
  },
  radioText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  radioTextActive: {
    color: COLORS.accentBlue,
  },

  // Botão Salvar
  saveButton: {
    backgroundColor: COLORS.accentBlue,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    // Margem inferior extra para evitar colisão com a barra de navegação
    marginBottom: Platform.OS === 'android' ? 50 : 40,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
