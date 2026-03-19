import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal, ScrollView,
  TextInput, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import * as visitController from '../../controllers/visitsController';
import styles from './style';
import COLORS from '../../constants/colors';

const VISIT_TYPE_COLORS = {
  'Rotina':      { bg: '#EFF6FF', text: '#2563EB' },
  'Busca Ativa': { bg: '#F3E8FF', text: '#7C3AED' },
  'Urgência':    { bg: '#FEE2E2', text: '#DC2626' },
};

export default function FamilyDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const { familyId } = route.params;
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [visits, setVisits] = useState([]);

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

  // Recarrega visitas toda vez que a tela ganhar foco
  // (ex: ao voltar da tela NovaVisita)
  useFocusEffect(
    useCallback(() => {
      loadVisits();
    }, [familyId])
  );

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

  async function loadVisits() {
    try {
      const data = await visitController.getVisitsByFamily(familyId);
      setVisits(data);
    } catch (error) {
      console.error('Erro ao carregar visitas:', error);
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
      nome, dataNascimento, sexo,
      gestante: sexo === 'F' ? gestante : false,
      condicoes,
    };

    const currentMembers = family.membros || [];
    const updatedMembers = editingIndex !== null
      ? currentMembers.map((m, i) => i === editingIndex ? member : m)
      : [...currentMembers, member];

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

  async function handleDeleteVisit(visitId) {
    Alert.alert('Remover', 'Deseja excluir esta visita?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await visitController.deleteVisit(visitId);
            setVisits(prev => prev.filter(v => v.id !== visitId));
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

  function navigateToNewVisit() {
    navigation.navigate('NovaVisita', {
      familyId,
      familyName: family?.responsavel || '',
      members: family?.membros || [],
    });
  }

  if (loading || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.grey }}>Carregando...</Text>
      </View>
    );
  }

  const members = family.membros || [];

  // Dados para o FlatList combinando membros + visitas em seções
  const listSections = [
    { type: 'membersHeader' },
    ...members.map((m, i) => ({ type: 'member', item: m, index: i })),
    ...(members.length === 0 ? [{ type: 'emptyMembers' }] : []),
    { type: 'visitsHeader' },
    ...visits.map(v => ({ type: 'visit', item: v })),
    ...(visits.length === 0 ? [{ type: 'emptyVisits' }] : []),
  ];

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
              <Text style={styles.metaLabel}>Visitas</Text>
              <Text style={styles.metaValue}>{visits.length}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* FLAT LIST UNIFICADA */}
      <FlatList
        data={listSections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item: row }) => {
          // ── Cabeçalho de membros ──
          if (row.type === 'membersHeader') {
            return (
              <Text style={styles.sectionTitle}>MEMBROS ({members.length})</Text>
            );
          }

          // ── Membro ──
          if (row.type === 'member') {
            const { item, index } = row;
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
          }

          // ── Empty membros ──
          if (row.type === 'emptyMembers') {
            return (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={40} color={COLORS.grey} />
                <Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
                <Text style={styles.emptySubtext}>Toque no + para adicionar</Text>
              </View>
            );
          }

          // ── Cabeçalho de visitas ──
          if (row.type === 'visitsHeader') {
            return (
              <View style={styles.visitsSectionHeader}>
                <Text style={styles.sectionTitle}>VISITAS ({visits.length})</Text>
                <TouchableOpacity style={styles.novaVisitaBtn} onPress={navigateToNewVisit}>
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.novaVisitaBtnText}>Nova Visita</Text>
                </TouchableOpacity>
              </View>
            );
          }

          // ── Card de visita ──
          if (row.type === 'visit') {
            const { item } = row;
            const typeStyle = VISIT_TYPE_COLORS[item.tipoVisita] || VISIT_TYPE_COLORS['Rotina'];
            return (
              <View style={styles.visitCard}>
                <View style={styles.visitCardLeft}>
                  <View style={[styles.visitTypeBadge, { backgroundColor: typeStyle.bg }]}>
                    <Text style={[styles.visitTypeBadgeText, { color: typeStyle.text }]}>
                      {item.tipoVisita}
                    </Text>
                  </View>
                  <Text style={styles.visitPaciente}>{item.paciente}</Text>
                  <Text style={styles.visitMotivo} numberOfLines={1}>{item.motivo}</Text>
                  <View style={styles.visitMeta}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.grey} />
                    <Text style={styles.visitMetaText}>{item.dataVisita}</Text>
                    {!!item.pressao && (
                      <>
                        <Text style={styles.visitMetaDot}>•</Text>
                        <FontAwesome5 name="heartbeat" size={11} color="#EF4444" />
                        <Text style={styles.visitMetaText}>{item.pressao}</Text>
                      </>
                    )}
                    {!!item.glicemia && (
                      <>
                        <Text style={styles.visitMetaDot}>•</Text>
                        <FontAwesome5 name="tint" size={11} color="#F59E0B" />
                        <Text style={styles.visitMetaText}>{item.glicemia}</Text>
                      </>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.visitDeleteBtn}
                  onPress={() => handleDeleteVisit(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          }

          // ── Empty visitas ──
          if (row.type === 'emptyVisits') {
            return (
              <View style={[styles.emptyContainer, { marginTop: 8 }]}>
                <Ionicons name="clipboard-outline" size={40} color={COLORS.grey} />
                <Text style={styles.emptyText}>Nenhuma visita registrada</Text>
                <Text style={styles.emptySubtext}>Toque em "Nova Visita" para adicionar</Text>
              </View>
            );
          }

          return null;
        }}
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
            <Text style={styles.formLabel}>NOME COMPLETO *</Text>
            <TextInput
              style={styles.formInput}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Maria Silva"
              placeholderTextColor={COLORS.grey}
            />

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

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMember}>
              <Text style={styles.saveButtonText}>
                {editingIndex !== null ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR MEMBRO'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* FAB - Adicionar Membro */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}