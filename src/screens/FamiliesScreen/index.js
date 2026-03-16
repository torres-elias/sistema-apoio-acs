import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Modal, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import styles from './style';

export default function FamiliesScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [families, setFamilies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Estados do Formulário (RF-03)
  const [responsavel, setResponsavel] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [tipoMoradia, setTipoMoradia] = useState('Casa');

  // Estados de Nova Visita
  const [visitaModalVisible, setVisitaModalVisible] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [tipoVisita, setTipoVisita] = useState('Rotina');
  const [motivoVisita, setMotivoVisita] = useState('');

  const tiposMoradia = [
    'Casa', 'Prédio', 'Estúdio', 'Kitnet', 'Apartamento', 
    'Condomínio', 'Chácara', 'Sítio', 'Fazenda', 'República', 'Casa de Pensão'
  ];

  const tiposDeVisita = ['Rotina', 'Busca Ativa', 'Urgência'];

  // Busca de CEP Automática (RF-03)
  const handleCepChange = async (value) => {
    const cleanedCep = value.replace(/\D/g, '');
    setCep(cleanedCep);

    if (cleanedCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          Alert.alert("Erro", "CEP não encontrado.");
        } else {
          setLogradouro(data.logradouro);
          setBairro(data.bairro);
        }
      } catch (error) {
        Alert.alert("Erro", "Falha ao conectar ao serviço de CEP.");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSave = () => {
    if (!responsavel || !logradouro || !numero || !bairro || cep.length < 8) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    const familyData = {
      id: editingId || Math.random().toString(),
      responsible: responsavel,
      address: `${logradouro}, ${numero} - ${bairro}`,
      raw: { responsavel, cep, logradouro, numero, bairro, tipoMoradia }
    };

    if (editingId) {
      // Edição (RF-04)
      setFamilies(families.map(f => f.id === editingId ? familyData : f));
    } else {
      // Cadastro (RF-03)
      setFamilies([...families, familyData]);
    }
    closeModal();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setResponsavel(item.raw.responsavel);
    setCep(item.raw.cep);
    setLogradouro(item.raw.logradouro);
    setNumero(item.raw.numero);
    setBairro(item.raw.bairro);
    setTipoMoradia(item.raw.tipoMoradia);
    setModalVisible(true);
  };

  const handleRemove = (id) => {
    Alert.alert("Remover", "Deseja excluir este registro de família?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setFamilies(families.filter(f => f.id !== id)) }
    ]);
  };

  const openVisitaModal = (nomeResponsavel) => {
    setPacienteSelecionado(nomeResponsavel);
    setTipoVisita('Rotina');
    setMotivoVisita('');
    setPressaoArterial('');
    setVisitaModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setResponsavel(''); setCep(''); setLogradouro(''); setNumero(''); setBairro(''); setTipoMoradia('Casa');
  };

  // Filtro Global (RF-07)
  const filteredFamilies = families.filter(f => 
    f.responsible.toLowerCase().includes(searchText.toLowerCase()) || 
    f.address.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Famílias</Text>
      </View>

      {/* BUSCA (RF-07) */}
      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou endereço..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* LISTAGEM */}
      <FlatList
        data={filteredFamilies}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.familyCard}>
            <View style={styles.cardInfo}>
              <View style={styles.iconContainer}><FontAwesome5 name="home" size={18} color="#2f80c1" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responsibleName}>{item.responsible}</Text>
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              {/* NOVO BOTÃO: Abrir Nova Visita */}
              <TouchableOpacity style={styles.iconBtn} onPress={() => openVisitaModal(item.responsible)}>
                <FontAwesome5 name="clipboard-list" size={20} color="#28a745" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color="#2f80c1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleRemove(item.id)}>
                <Ionicons name="trash" size={20} color="#ff3c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 30, color: '#999'}}>Nenhuma família cadastrada.</Text>}
      />

      {/* FORMULÁRIO MODAL (CADASTRO E EDIÇÃO) */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{editingId ? 'Editar Família' : 'Nova Família'}</Text>
          </View>
          
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.label}>Responsável Familiar *</Text>
            <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} placeholder="Ex: João Silva" />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '58%' }}>
                <Text style={styles.label}>CEP *</Text>
                <View style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 0, paddingRight: 10 }]}>
                  <TextInput 
                    style={{ flex: 1, padding: 12 }} 
                    value={cep} 
                    onChangeText={handleCepChange} 
                    keyboardType="numeric" 
                    maxLength={8} 
                    placeholder="Somente números" 
                  />
                  {loadingCep && <ActivityIndicator color="#2f80c1" />}
                </View>
              </View>
              <View style={{ width: '38%' }}>
                <Text style={styles.label}>Número *</Text>
                <TextInput style={styles.input} value={numero} onChangeText={setNumero} keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.label}>Logradouro *</Text>
            <TextInput style={[styles.input, loadingCep && { backgroundColor: '#eee' }]} value={logradouro} onChangeText={setLogradouro} editable={!loadingCep} />

            <Text style={styles.label}>Bairro *</Text>
            <TextInput style={[styles.input, loadingCep && { backgroundColor: '#eee' }]} value={bairro} onChangeText={setBairro} editable={!loadingCep} />

            <Text style={styles.label}>Tipo de Moradia</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
              {tiposMoradia.map(tipo => (
                <TouchableOpacity 
                  key={tipo} 
                  style={[styles.tipoBtn, tipoMoradia === tipo && styles.tipoBtnActive]}
                  onPress={() => setTipoMoradia(tipo)}
                >
                  <Text style={[styles.tipoBtnText, tipoMoradia === tipo && styles.tipoBtnTextActive]}>{tipo}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{editingId ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FAMÍLIA'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

     {/* FORMULÁRIO MODAL (VISITA) */}
      <Modal visible={visitaModalVisible} animationType="slide">
        <View style={styles.visitaContainer}>
          <View style={styles.visitaHeader}>
            <View style={styles.visitaHeaderContent}>
              <TouchableOpacity style={styles.visitaBackButton} onPress={() => setVisitaModalVisible(false)}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <View>
                <Text style={styles.visitaTitle}>Nova Visita</Text>
                <Text style={styles.visitaSubtitle}>{pacienteSelecionado}</Text>
              </View>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.visitaScrollContent} showsVerticalScrollIndicator={false}>

              <View style={styles.visitaCard}>
                
                <View style={styles.visitaInputGroup}>
                  <Text style={styles.visitaLabel}>TIPO DE VISITA</Text>
                  <View style={styles.visitaRadioGroup}>
                    {tiposDeVisita.map((tipo) => (
                      <TouchableOpacity
                        key={tipo}
                        style={[styles.visitaRadioButton, tipoVisita === tipo && styles.visitaRadioButtonActive]}
                        onPress={() => setTipoVisita(tipo)}
                      >
                        <Text style={[styles.visitaRadioText, tipoVisita === tipo && styles.visitaRadioTextActive]}>
                          {tipo}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.visitaInputGroup}>
                  <Text style={styles.visitaLabel}>PACIENTE (OPCIONAL)</Text>
                  <TouchableOpacity style={styles.visitaInputContainer}>
                    <Text style={styles.visitaInputText}>Visita geral à família</Text>
                    <Ionicons name="chevron-down" size={20} color="#999" />
                  </TouchableOpacity>
                </View>

                <View style={styles.visitaInputGroup}>
                  <Text style={styles.visitaLabel}>MOTIVO</Text>
                  <View style={styles.visitaInputContainer}>
                    <TextInput
                      style={styles.visitaTextInputField}
                      placeholder="Ex: Acompanhamento mensal"
                      placeholderTextColor="#999"
                      value={motivoVisita}
                      onChangeText={setMotivoVisita}
                    />
                  </View>
                </View>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}