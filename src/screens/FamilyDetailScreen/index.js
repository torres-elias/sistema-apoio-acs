import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal, ScrollView,
  TextInput, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import styles from './style';
import COLORS from '../../constants/colors';

export default function FamilyDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const { familyId } = route.params;
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Member form states
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('M');
  const [gestante, setGestante] = useState(false);
  const [condicoes, setCondicoes] = useState([]);

  const condicoesOptions = [
    { key: 'hipertensao', label: 'Hipertensão', icon: 'heartbeat', color: '#EF4444' },
    { key: 'diabetes', label: 'Diabetes', icon: 'tint', color: '#F59E0B' },
  ];

  useEffect(() => {
    loadFamily();
  }, []);

  async function loadFamily() {
    setLoading(true);
    try {
      const families = await familyController.getFamilies(user.uid);
      const found = families.find(f => f.id === familyId);
      if (found) {
        setFamily(found);
      } else {
        Alert.alert('Erro', 'Família não encontrada.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  function calculateAge(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const birth = new Date(parts[2], parts[1] - 1, parts[0]);
    const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  }

  function formatDateInput(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }

  function handleDateChange(value) {
    setDataNascimento(formatDateInput(value));
  }

  function toggleCondicao(key) {
    if (condicoes.includes(key)) {
      setCondicoes(condicoes.filter(c => c !== key));
    } else {
      setCondicoes([...condicoes, key]);
    }
  }

  async function handleSaveMember() {
    if (!nome || !dataNascimento) {
      Alert.alert('Atenção', 'Preencha nome e data de nascimento.');
      return;
    }

    const age = calculateAge(dataNascimento);
    if (age === null || age < 0 || age > 150) {
      Alert.alert('Atenção', 'Data de nascimento inválida. Use o formato DD/MM/AAAA.');
      return;
    }

    const member = {
      nome,
      dataNascimento,
      sexo,
      gestante: sexo === 'F' ? gestante : false,
      condicoes,
    };

    const currentMembers = family.membros || [];
    let updatedMembers;

    if (editingIndex !== null) {
      updatedMembers = currentMembers.map((m, i) => i === editingIndex ? member : m);
    } else {
      updatedMembers = [...currentMembers, member];
    }

    try {
      await familyController.updateFamily(familyId, { membros: updatedMembers });
      setFamily({ ...family, membros: updatedMembers });
      closeModal();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  function handleEditMember(index) {
    const member = family.membros[index];
    setEditingIndex(index);
    setNome(member.nome);
    setDataNascimento(member.dataNascimento);
    setSexo(member.sexo);
    setGestante(member.gestante || false);
    setCondicoes(member.condicoes || []);
    setModalVisible(true);
  }

  function handleRemoveMember(index) {
    const member = family.membros[index];
    Alert.alert('Remover', `Deseja remover ${member.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const updatedMembers = family.membros.filter((_, i) => i !== index);
          try {
            await familyController.updateFamily(familyId, { membros: updatedMembers });
            setFamily({ ...family, membros: updatedMembers });
          } catch (error) {
            Alert.alert('Erro', error.message);
          }
        }
      }
    ]);
  }

  function closeModal() {
    setModalVisible(false);
    setEditingIndex(null);
    setNome('');
    setDataNascimento('');
    setSexo('M');
    setGestante(false);
    setCondicoes([]);
  }

  if (loading || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.grey }}>Carregando...</Text>
      </View>
    );
  }

  const members = family.membros || [];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Família</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* FAMILY INFO */}
        <View style={styles.familyInfoCard}>
          <View style={styles.familyInfoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.familyName}>{family.responsavel}</Text>
              <Text style={styles.familyAddress}>
                {family.logradouro}, {family.numero} - {family.bairro}
              </Text>
            </View>
          </View>
          <View style={styles.familyMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Moradia</Text>
              <Text style={styles.metaValue}>{family.tipoMoradia}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Membros</Text>
              <Text style={styles.metaValue}>{members.length}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Bairro</Text>
              <Text style={styles.metaValue}>{family.bairro}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* MEMBERS LIST */}
      <FlatList
        data={members}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>MEMBROS ({members.length})</Text>
        }
        renderItem={({ item, index }) => {
          const age = calculateAge(item.dataNascimento);
          return (
            <View style={styles.memberCard}>
              <View style={[
                styles.memberAvatar,
                { backgroundColor: item.sexo === 'M' ? '#EFF6FF' : '#FDF2F8' }
              ]}>
                <Ionicons
                  name={item.sexo === 'M' ? 'male' : 'female'}
                  size={20}
                  color={item.sexo === 'M' ? '#3B82F6' : '#EC4899'}
                />
              </View>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.nome}</Text>
                <View style={styles.memberDetails}>
                  <Text style={styles.memberAge}>
                    {age !== null ? `${age} anos` : ''}
                  </Text>
                  {item.gestante && (
                    <Text style={styles.gestanteTag}>• Gestante</Text>
                  )}
                </View>
              </View>

              <View style={styles.memberTags}>
                {(item.condicoes || []).map(c => (
                  <View key={c} style={[
                    styles.conditionTag,
                    { backgroundColor: c === 'hipertensao' ? '#FEE2E2' : '#FEF3C7' }
                  ]}>
                    <Text style={[
                      styles.conditionTagText,
                      { color: c === 'hipertensao' ? '#DC2626' : '#D97706' }
                    ]}>
                      {c === 'hipertensao' ? 'HAS' : 'DM'}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.memberActions}>
                <TouchableOpacity style={styles.memberActionBtn} onPress={() => handleEditMember(index)}>
                  <Ionicons name="pencil" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.memberActionBtn} onPress={() => handleRemoveMember(index)}>
                  <Ionicons name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={COLORS.grey} />
            <Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
            <Text style={styles.emptySubtext}>Toque no + para adicionar</Text>
          </View>
        }
      />

      {/* MEMBER FORM MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {editingIndex !== null ? 'Editar Membro' : 'Novo Membro'}
            </Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* Name */}
            <Text style={styles.formLabel}>NOME COMPLETO *</Text>
            <TextInput
              style={styles.formInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Maria Silva"
              placeholderTextColor={COLORS.grey}
            />

            {/* Birth Date */}
            <Text style={styles.formLabel}>DATA DE NASCIMENTO *</Text>
            <TextInput
              style={styles.formInput}
              value={dataNascimento}
              onChangeText={handleDateChange}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={COLORS.grey}
              keyboardType="numeric"
              maxLength={10}
            />

            {/* Sex */}
            <Text style={styles.formLabel}>SEXO</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, sexo === 'M' && styles.toggleBtnActiveM]}
                onPress={() => { setSexo('M'); setGestante(false); }}
              >
                <Ionicons name="male" size={18} color={sexo === 'M' ? '#fff' : '#3B82F6'} />
                <Text style={[styles.toggleBtnText, sexo === 'M' && styles.toggleBtnTextActive]}>
                  Masculino
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, sexo === 'F' && styles.toggleBtnActiveF]}
                onPress={() => setSexo('F')}
              >
                <Ionicons name="female" size={18} color={sexo === 'F' ? '#fff' : '#EC4899'} />
                <Text style={[styles.toggleBtnText, sexo === 'F' && styles.toggleBtnTextActive]}>
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pregnant - only for female */}
            {sexo === 'F' && (
              <>
                <Text style={styles.formLabel}>GESTANTE</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, gestante && { backgroundColor: '#EC4899', borderColor: '#EC4899' }]}
                    onPress={() => setGestante(true)}
                  >
                    <Text style={[styles.toggleBtnText, gestante && styles.toggleBtnTextActive]}>Sim</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, !gestante && { backgroundColor: COLORS.greyDark, borderColor: COLORS.greyDark }]}
                    onPress={() => setGestante(false)}
                  >
                    <Text style={[styles.toggleBtnText, !gestante && styles.toggleBtnTextActive]}>Não</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Conditions */}
            <Text style={styles.formLabel}>CONDIÇÕES DE SAÚDE</Text>
            <View style={styles.conditionsGrid}>
              {condicoesOptions.map(opt => {
                const selected = condicoes.includes(opt.key);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.conditionBtn, selected && { backgroundColor: opt.color, borderColor: opt.color }]}
                    onPress={() => toggleCondicao(opt.key)}
                  >
                    <FontAwesome5
                      name={opt.icon}
                      size={16}
                      color={selected ? '#fff' : opt.color}
                    />
                    <Text style={[styles.conditionBtnText, selected && { color: '#fff' }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMember}>
              <Text style={styles.saveButtonText}>
                {editingIndex !== null ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR MEMBRO'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}