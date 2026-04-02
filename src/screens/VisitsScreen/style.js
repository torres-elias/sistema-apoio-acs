import { StyleSheet, Platform, StatusBar } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },

  // Busca
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: "#333",
  },

  // Listagem de Famílias
  listContainer: {
    paddingHorizontal: 15,
    // Aumentado para garantir que a última família da lista não fique 
    // escondida atrás dos botões de navegação do Android
    paddingBottom: Platform.OS === 'android' ? 120 : 100,
  },
  familyCard: {
    backgroundColor: "#fff",
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
    color: "#333",
  },
  addressText: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    paddingLeft: 5,
  },
  iconBtn: {
    padding: 8,
  },

  // Modal / Tela de Registro de Visita
  modalContainer: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerVisita: {
    backgroundColor: '#2f80c1',
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
    color: '#fff',
  },
  subtitleVisita: {
    fontSize: 14,
    color: '#fff',
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
    backgroundColor: '#fff',
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
    color: '#8A94A6',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainerVisita: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 52,
  },
  inputInnerVisita: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  inputTextVisita: {
    fontSize: 15,
    color: '#333',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  radioButtonActive: {
    borderColor: '#2f80c1',
    backgroundColor: '#2f80c115', 
  },
  radioText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  radioTextActive: {
    color: '#2f80c1',
  },

  // Botão Salvar
  saveButton: {
    backgroundColor: '#2f80c1',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    // Margem inferior extra para evitar colisão com a barra de navegação
    marginBottom: Platform.OS === 'android' ? 50 : 40,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});