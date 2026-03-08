import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import styles from './style';

export default function FamiliesScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [families, setFamilies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Estados dos Campos (RF-03)
  const [responsavel, setResponsavel] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [tipoMoradia, setTipoMoradia] = useState('Casa');

  const tiposMoradia = ['Casa', 'Prédio', 'Estúdio', 'Kitnet', 'Apartamento', 'Condomínio', 'Chácara', 'Sítio', 'Fazenda', 'República', 'Casa de Pensão'];

  const handleSave = () => {
    if (!responsavel || !cep || !logradouro || !numero || !bairro) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os campos com asterisco (*).");
      return;
    }

    const familyData = {
      id: editingId || Math.random().toString(),
      responsible: responsavel,
      address: `${logradouro}, ${numero} - ${bairro}`,
      raw: { responsavel, cep, logradouro, numero, bairro, tipoMoradia }
    };

    if (editingId) {
      setFamilies(families.map(f => f.id === editingId ? familyData : f));
    } else {
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
    Alert.alert("Remover Família", "Tem certeza que deseja excluir este registo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setFamilies(families.filter(f => f.id !== id)) }
    ]);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setResponsavel(''); setCep(''); setLogradouro(''); setNumero(''); setBairro(''); setTipoMoradia('Casa');
  };

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
        <Text style={styles.headerTitle}>Territorialização</Text>
      </View>

      {/* BUSCA DINÂMICA (RF-07) */}
      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou endereço..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* LISTA DE FAMÍLIAS */}
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
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color="#2f80c1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleRemove(item.id)}>
                <Ionicons name="trash" size={20} color="#ff3c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>Nenhuma família registada.</Text>}
      />

      {/* MODAL DE CADASTRO/EDIÇÃO (RF-03/RF-04) */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{editingId ? 'Editar Domicílio' : 'Novo Cadastro'}</Text>
          </View>
          
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.label}>Responsável Familiar *</Text>
            <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} placeholder="Nome completo" />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '48%' }}>
                <Text style={styles.label}>CEP *</Text>
                <TextInput style={styles.input} value={cep} onChangeText={setCep} keyboardType="numeric" placeholder="00000-000" />
              </View>
              <View style={{ width: '48%' }}>
                <Text style={styles.label}>Número *</Text>
                <TextInput style={styles.input} value={numero} onChangeText={setNumero} keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.label}>Logradouro *</Text>
            <TextInput style={styles.input} value={logradouro} onChangeText={setLogradouro} placeholder="Rua, Av, etc." />

            <Text style={styles.label}>Bairro *</Text>
            <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />

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
              <Text style={styles.saveButtonText}>{editingId ? 'GUARDAR ALTERAÇÕES' : 'FINALIZAR REGISTO'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* BOTÃO FLUTUANTE ADICIONAR */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}