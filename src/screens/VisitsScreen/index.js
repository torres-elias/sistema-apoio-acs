import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Alert
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getVisitsByAcs, deleteVisit } from '../../controllers/visitsController';
import { auth } from '../../config/firebase';
import VisitEditModal from './VisitEditModal';
import styles from './style';

export default function VisitasScreen({ navigation }) {
  //Estado da tela 
  const [visitas, setVisitas]       = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editingVisit, setEditingVisit] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadVisits();
    }, [])
  );

  async function loadVisits() {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const data = await getVisitsByAcs(user.uid);
      setVisitas(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as visitas.');
    }
  }

  function handleRemove(id) {
    Alert.alert('Remover', 'Deseja excluir este registro de visita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await deleteVisit(id);
            loadVisits();
          } catch {
            Alert.alert('Erro', 'Erro ao excluir.');
          }
        }
      }
    ]);
  }

  const filteredVisitas = visitas.filter(v =>
    v.paciente.toLowerCase().includes(searchText.toLowerCase()) ||
    v.motivo.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitas Realizadas</Text>
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

      {/* LISTA */}
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
                  {item.tipoVisita} • {item.dataVisita}
                </Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => setEditingVisit(item)}
              >
                <Ionicons name="pencil" size={20} color="#2f80c1" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleRemove(item.id)}
              >
                <Ionicons name="trash" size={20} color="#ff3c3c" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#999' }}>
            Nenhuma visita registrada.
          </Text>
        }
      />

      {/* MODAL DE EDIÇÃO */}
      <VisitEditModal
        visible={editingVisit !== null}
        editingVisit={editingVisit}
        onClose={() => setEditingVisit(null)}
        onSaved={() => {
          setEditingVisit(null);
          loadVisits();
        }}
      />
    </View>
  );
}