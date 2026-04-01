import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Alert
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import * as visitController from '../../controllers/visitsController';
import MemberFormModal from './MemberFormModal';
import VisitFormModal from './VisitFormModal';
import styles from './style';
import COLORS from '../../constants/colors';

const VISIT_TYPE_COLORS = {
  'Rotina':      { bg: '#EFF6FF', text: '#2563EB' },
  'Busca Ativa': { bg: '#F3E8FF', text: '#7C3AED' },
  'Urgência':    { bg: '#FEE2E2', text: '#DC2626' },
};

function calculateAge(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  const birth = new Date(parts[2], parts[1] - 1, parts[0]);
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

export default function FamilyDetailScreen({ route, navigation }) {
  const { user } = useAuth();
  const { familyId } = route.params;

  //Estado da tela
  const [family, setFamily]   = useState(null);
  const [visits, setVisits]   = useState([]);
  const [loading, setLoading] = useState(true);

  //Controle dos modais 
  const [memberModal, setMemberModal]     = useState(null);
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [familyId])
  );

  async function loadAll() {
    setLoading(true);
    try {
      const families = await familyController.getFamilies(user.uid);
      const found    = families.find(f => f.id === familyId);
      if (!found) {
        Alert.alert('Erro', 'Família não encontrada.');
        navigation.goBack();
        return;
      }
      const visitsData = await visitController.getVisitsByFamily(familyId);
      setFamily(found);
      setVisits(visitsData);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveMember(memberData) {
    const currentMembers = family.membros || [];
    const isEditing      = memberModal !== 'new';

    const updatedMembers = isEditing
      ? currentMembers.map(m => m === memberModal ? memberData : m)
      : [...currentMembers, memberData];

    try {
      await familyController.updateFamily(familyId, { membros: updatedMembers });
      setFamily(prev => ({ ...prev, membros: updatedMembers }));
      setMemberModal(null);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  function handleRemoveMember(member) {
    Alert.alert('Remover', `Deseja remover ${member.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const updatedMembers = (family.membros || []).filter(m => m !== member);
          try {
            await familyController.updateFamily(familyId, { membros: updatedMembers });
            setFamily(prev => ({ ...prev, membros: updatedMembers }));
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

  async function reloadVisits() {
    try {
      const data = await visitController.getVisitsByFamily(familyId);
      setVisits(data);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  if (loading || !family) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.grey }}>Carregando...</Text>
      </View>
    );
  }

  const members = family.membros || [];

  const listSections = [
    { type: 'membersHeader' },
    ...members.map(m => ({ type: 'member', item: m })),
    ...(members.length === 0 ? [{ type: 'emptyMembers' }] : []),
    { type: 'visitsHeader' },
    ...visits.map(v => ({ type: 'visit', item: v })),
    ...(visits.length === 0 ? [{ type: 'emptyVisits' }] : []),
  ];

  function renderRow({ item: row }) {
    if (row.type === 'membersHeader') {
      return <Text style={styles.sectionTitle}>MEMBROS ({members.length})</Text>;
    }

    if (row.type === 'member') {
      const { item } = row;
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
              <Text style={styles.memberAge}>{age !== null ? `${age} anos` : ''}</Text>
              {item.gestante && <Text style={styles.gestanteTag}>• Gestante</Text>}
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
            <TouchableOpacity
              style={styles.memberActionBtn}
              onPress={() => setMemberModal(item)}
            >
              <Ionicons name="pencil" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.memberActionBtn}
              onPress={() => handleRemoveMember(item)}
            >
              <Ionicons name="trash" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (row.type === 'emptyMembers') {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={40} color={COLORS.grey} />
          <Text style={styles.emptyText}>Nenhum membro cadastrado</Text>
          <Text style={styles.emptySubtext}>Toque no + para adicionar</Text>
        </View>
      );
    }

    if (row.type === 'visitsHeader') {
      return (
        <View style={styles.visitsSectionHeader}>
          <Text style={styles.sectionTitle}>VISITAS ({visits.length})</Text>
          <TouchableOpacity
            style={styles.novaVisitaBtn}
            onPress={() => setVisitModalOpen(true)}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.novaVisitaBtnText}>Nova Visita</Text>
          </TouchableOpacity>
        </View>
      );
    }

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
  }

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

      {/* LISTA */}
      <FlatList
        data={listSections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={renderRow}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMemberModal('new')}
      >
        <Ionicons name="person-add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* MODAIS */}
      <MemberFormModal
        visible={memberModal !== null}
        editingMember={memberModal !== 'new' ? memberModal : null}
        onClose={() => setMemberModal(null)}
        onSave={handleSaveMember}
      />

      <VisitFormModal
        visible={visitModalOpen}
        familyId={familyId}
        familyName={family.responsavel}
        members={members}
        userId={user.uid}
        onClose={() => setVisitModalOpen(false)}
        onSaved={() => {
          setVisitModalOpen(false);
          reloadVisits();
        }}
      />
    </View>
  );
}