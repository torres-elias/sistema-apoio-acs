import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Modal, 
  ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import styles from './style';

export default function VisitasScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');
  
  const [visitas, setVisitas] = useState([]);

  // Estados do Modal de Edição
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [tipoVisita, setTipoVisita] = useState('Rotina');
  const [pacienteVisita, setPacienteVisita] = useState('');
  const [motivo, setMotivo] = useState('');
  const [pressao, setPressao] = useState('');

  const tiposDeVisita = ['Rotina', 'Busca Ativa', 'Urgência'];

  const handleEdit = (item) => {
    setEditingId(item.id);
    setPacienteVisita(item.paciente);
    setTipoVisita(item.tipo);
    setMotivo(item.motivo);
    setPressao(item.pressao);
    setModalVisible(true);
  };

  const handleSave = () => {
    const updatedVisitas = visitas.map(v => {
      if (v.id === editingId) {
        return { ...v, tipo: tipoVisita, motivo, pressao };
      }
      return v;
    });

    setVisitas(updatedVisitas);
    setModalVisible(false);
    Alert.alert("Sucesso", "Visita atualizada!");
  };

  const handleRemove = (id) => {
    Alert.alert("Remover", "Deseja excluir este registro de visita?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setVisitas(visitas.filter(v => v.id !== id)) }
    ]);
  };

  const filteredVisitas = visitas.filter(v => 
    v.paciente.toLowerCase().includes(searchText.toLowerCase()) || 
    v.motivo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* HEADER PRINCIPAL */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle]}>Visitas Realizadas</Text>
      </View>

      {/* BUSCA */}
      <View style={styles.searchSection}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por paciente ou motivo..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* LISTAGEM DE VISITAS */}
      <FlatList
        data={filteredVisitas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.familyCard}>
            <View style={styles.cardInfo}>
              <View style={[styles.iconContainer, { backgroundColor: '#e8f4fd' }]}>
                <FontAwesome5 name="clipboard-list" size={18} color="#2f80c1" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responsibleName}>{item.paciente}</Text>
                <Text style={styles.addressText}>
                  {item.tipo} • {item.data}
                </Text>
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
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 30, color: '#999'}}>
            Nenhuma visita registrada.
          </Text>
        }
      />

      {/* MODAL DE EDIÇÃO DE VISITA */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          
          <View style={styles.headerVisita}>
            <View style={styles.headerContentVisita}>
              <TouchableOpacity style={styles.backButtonVisita} onPress={() => setModalVisible(false)}>
                <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
              <View>
                <Text style={styles.titleVisita}>Editar Visita</Text>
                <Text style={styles.subtitleVisita}>{pacienteVisita}</Text>
              </View>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContentVisita} showsVerticalScrollIndicator={false}>
            <View style={styles.cardVisita}>
              
              <View style={styles.inputGroupVisita}>
                <Text style={styles.labelVisita}>TIPO DE VISITA</Text>
                <View style={styles.radioGroup}>
                  {tiposDeVisita.map((tipo) => (
                    <TouchableOpacity
                      key={tipo}
                      style={[styles.radioButton, tipoVisita === tipo && styles.radioButtonActive]}
                      onPress={() => setTipoVisita(tipo)}
                    >
                      <Text style={[styles.radioText, tipoVisita === tipo && styles.radioTextActive]}>
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroupVisita}>
                <Text style={styles.labelVisita}>PACIENTE</Text>
                <View style={[styles.inputContainerVisita, { backgroundColor: '#f0f0f0' }]}>
                  <Text style={[styles.inputTextVisita, { color: '#999' }]}>{pacienteVisita}</Text>
                </View>
              </View>

              <View style={styles.inputGroupVisita}>
                <Text style={styles.labelVisita}>MOTIVO</Text>
                <View style={styles.inputContainerVisita}>
                  <TextInput
                    style={styles.inputInnerVisita}
                    placeholder="Ex: Acompanhamento mensal"
                    placeholderTextColor="#999"
                    value={motivo}
                    onChangeText={setMotivo}
                  />
                </View>
              </View>

              <View style={styles.inputGroupVisita}>
                <Text style={styles.labelVisita}>PRESSÃO ARTERIAL</Text>
                <View style={styles.inputContainerVisita}>
                  <TextInput
                    style={styles.inputInnerVisita}
                    placeholder="Ex: 120/80"
                    placeholderTextColor="#999"
                    value={pressao}
                    onChangeText={setPressao}
                    keyboardType="numeric"
                  />
                </View>
              </View>

            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}