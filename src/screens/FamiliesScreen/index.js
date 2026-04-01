import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  Alert, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import FamilyEditModal from './FamilyEditModal';
import styles from './style';
import COLORS from '../../constants/colors';

export default function FamiliesScreen({ navigation }) {
  const { user } = useAuth();

  //Estado da tela
  const [families, setFamilies]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchText, setSearchText] = useState('');
  const [editingFamily, setEditingFamily] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadFamilies();
    }, [])
  );

  async function loadFamilies() {
    setLoading(true);
    try {
      const data = await familyController.getFamilies(user.uid);
      setFamilies(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRemove(id) {
    Alert.alert('Remover', 'Deseja excluir este registro de família?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await familyController.deleteFamily(id);
            loadFamilies();
          } catch (error) {
            Alert.alert('Erro', error.message);
          }
        }
      }
    ]);
  }

  const filteredFamilies = families.filter(f =>
    f.responsavel.toLowerCase().includes(searchText.toLowerCase()) ||
    f.logradouro.toLowerCase().includes(searchText.toLowerCase())  ||
    f.bairro.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Famílias</Text>
          <Text style={styles.headerCount}>{families.length} cadastros</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou endereço..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredFamilies}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => {
            const memberCount = item.membros?.length || 0;
            return (
              <TouchableOpacity
                style={styles.familyCard}
                onPress={() => navigation.navigate('FamilyDetail', { familyId: item.id })}
                activeOpacity={0.7}
              >
                <View style={styles.cardNumberBadge}>
                  <Text style={styles.cardNumberText}>{index + 1}</Text>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.responsibleName}>{item.responsavel}</Text>
                  <View style={styles.addressRow}>
                    <Ionicons name="location-sharp" size={13} color={COLORS.grey} />
                    <Text style={styles.addressText} numberOfLines={1}>
                      {item.logradouro}, {item.numero} - {item.bairro}
                    </Text>
                  </View>
                  <View style={styles.cardTags}>
                    <View style={styles.tag}>
                      <FontAwesome5 name="home" size={10} color={COLORS.primary} />
                      <Text style={styles.tagText}>{item.tipoMoradia}</Text>
                    </View>
                    {memberCount > 0 && (
                      <View style={styles.tag}>
                        <Ionicons name="people" size={10} color={COLORS.primary} />
                        <Text style={styles.tagText}>{memberCount} membros</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => setEditingFamily(item)}
                  >
                    <Ionicons name="pencil" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleRemove(item.id)}
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="home" size={48} color={COLORS.grey} />
              <Text style={styles.emptyText}>Nenhuma família cadastrada</Text>
              <Text style={styles.emptySubtext}>Toque no + para cadastrar</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FamilyForm')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* MODAL DE EDIÇÃO */}
      <FamilyEditModal
        visible={editingFamily !== null}
        editingFamily={editingFamily}
        onClose={() => setEditingFamily(null)}
        onSaved={() => {
          setEditingFamily(null);
          loadFamilies();
        }}
      />
    </View>
  );
}