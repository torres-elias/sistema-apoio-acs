import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, TextInput,
  Alert, Modal, StyleSheet, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as unitController from '../../controllers/unitController';
import COLORS from '../../constants/colors';

export default function AdminScreen({ navigation }) {
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [unitNome, setUnitNome] = useState('');
  const [unitMunicipio, setUnitMunicipio] = useState('');
  const [unitEndereco, setUnitEndereco] = useState('');
  const [savingUnit, setSavingUnit] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUnits();
    }, [])
  );

  async function loadUnits() {
    setLoadingUnits(true);
    try {
      const data = await unitController.getUnits();
      setUnits(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoadingUnits(false);
    }
  }

  async function handleSaveUnit() {
    if (!unitNome || !unitMunicipio) {
      Alert.alert('Atenção', 'Preencha nome e município.');
      return;
    }

    setSavingUnit(true);
    try {
      await unitController.createUnit({
        nome: unitNome,
        municipio: unitMunicipio,
        endereco: unitEndereco,
      });
      Alert.alert('Sucesso', 'Unidade cadastrada.');
      setUnitModalVisible(false);
      setUnitNome('');
      setUnitMunicipio('');
      setUnitEndereco('');
      loadUnits();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setSavingUnit(false);
    }
  }

  function handleDeleteUnit(unit) {
    Alert.alert('Remover', `Deseja excluir "${unit.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await unitController.deleteUnit(unit.id);
            loadUnits();
          } catch (error) {
            Alert.alert('Erro', error.message);
          }
        }
      }
    ]);
  }

  return (
    <View style={styles.container}>
      {/* ACTIONS */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>GERENCIAMENTO</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('UserForm')}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.primary}14` }]}>
            <Ionicons name="person-add" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Cadastrar Usuário</Text>
            <Text style={styles.actionSub}>Novo ACS, Gerente ou Admin</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setUnitModalVisible(true)}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#10B98114' }]}>
            <Ionicons name="business" size={24} color="#10B981" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Nova Unidade de Saúde</Text>
            <Text style={styles.actionSub}>Cadastrar UBS ou posto</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </TouchableOpacity>
      </View>

      {/* UNITS LIST */}
      <Text style={styles.sectionTitle}>UNIDADES CADASTRADAS ({units.length})</Text>

      {loadingUnits ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={units}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.unitCard}>
              <View style={styles.unitIconBox}>
                <Ionicons name="business" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.unitInfo}>
                <Text style={styles.unitName}>{item.nome}</Text>
                <Text style={styles.unitMunicipio}>{item.municipio}</Text>
                {item.endereco ? (
                  <Text style={styles.unitEndereco}>{item.endereco}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.unitDeleteBtn}
                onPress={() => handleDeleteUnit(item)}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={48} color={COLORS.grey} />
              <Text style={styles.emptyText}>Nenhuma unidade cadastrada</Text>
            </View>
          }
        />
      )}

      {/* UNIT FORM MODAL */}
      <Modal visible={unitModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setUnitModalVisible(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Nova Unidade</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>NOME DA UNIDADE *</Text>
            <TextInput
              style={styles.input}
              value={unitNome}
              onChangeText={setUnitNome}
              placeholder="Ex: UBS Centro"
              placeholderTextColor={COLORS.grey}
            />

            <Text style={styles.label}>MUNICÍPIO *</Text>
            <TextInput
              style={styles.input}
              value={unitMunicipio}
              onChangeText={setUnitMunicipio}
              placeholder="Ex: João Pessoa"
              placeholderTextColor={COLORS.grey}
            />

            <Text style={styles.label}>ENDEREÇO</Text>
            <TextInput
              style={styles.input}
              value={unitEndereco}
              onChangeText={setUnitEndereco}
              placeholder="Ex: Rua das Flores, 100 - Centro"
              placeholderTextColor={COLORS.grey}
            />

            <TouchableOpacity
              style={[styles.saveButton, savingUnit && { opacity: 0.7 }]}
              onPress={handleSaveUnit}
              disabled={savingUnit}
            >
              {savingUnit ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>CADASTRAR UNIDADE</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 16,
    letterSpacing: 0.8,
  },
  actionsSection: {
    marginBottom: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  actionSub: { fontSize: 12, color: COLORS.grey, marginTop: 2 },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
  },
  unitIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unitInfo: { flex: 1 },
  unitName: { fontSize: 15, fontWeight: '600', color: '#1A202C' },
  unitMunicipio: { fontSize: 12, color: COLORS.grey, marginTop: 2 },
  unitEndereco: { fontSize: 11, color: COLORS.grey, marginTop: 1 },
  unitDeleteBtn: { padding: 8 },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: { fontSize: 14, color: COLORS.grey, marginTop: 12 },

  modalContainer: { flex: 1, backgroundColor: '#F0F4F8' },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalContent: { padding: 20 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1A202C',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 28,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
});
