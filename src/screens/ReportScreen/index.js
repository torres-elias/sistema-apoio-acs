import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Alert, ActivityIndicator,
  TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import COLORS from '../../constants/colors';
import { calculateAge } from '../../utils/formatters';

export default function ReportScreen() {
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [unitName, setUnitName] = useState('');
  const [acsUsers, setAcsUsers] = useState([]);
  const [allFamilies, setAllFamilies] = useState([]);
  const [allVisits, setAllVisits] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadReport();
    }, [])
  );

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível deslogar.');
    }
  }

  async function loadReport() {
    setLoading(true);
    try {
      // Get unit name
      if (profile?.unidadeId) {
        const { doc: docRef, getDoc } = await import('firebase/firestore');
        const unitDoc = await getDoc(docRef(db, 'units', profile.unidadeId));
        if (unitDoc.exists()) {
          setUnitName(unitDoc.data().nome);
        }
      }

      // Get all ACS from same unit
      const usersQuery = query(
        collection(db, 'users'),
        where('unidadeId', '==', profile?.unidadeId),
        where('cargo', '==', 'ACS')
      );
      const usersSnap = await getDocs(usersQuery);
      const acsData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAcsUsers(acsData);

      // Get families for each ACS
      let families = [];
      let visits = [];

      for (const acs of acsData) {
        const famQuery = query(
          collection(db, 'families'),
          where('acsUid', '==', acs.id)
        );
        const famSnap = await getDocs(famQuery);
        const acsFamilies = famSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          acsNome: acs.nome
        }));
        families = [...families, ...acsFamilies];

        const visitQuery = query(
          collection(db, 'visits'),
          where('acsUid', '==', acs.id)
        );
        const visitSnap = await getDocs(visitQuery);
        const acsVisits = visitSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          acsNome: acs.nome
        }));
        visits = [...visits, ...acsVisits];
      }

      setAllFamilies(families);
      setAllVisits(visits);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro ao carregar relatório.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate stats
  const totalFamilies = allFamilies.length;
  const allMembers = allFamilies.flatMap(f => f.membros || []);
  const totalMembers = allFamilies.reduce((acc, f) => acc + 1 + (f.membros?.length || 0), 0);

  const hipertensos = allMembers.filter(m => m.condicoes?.includes('hipertensao')).length;
  const diabeticos = allMembers.filter(m => m.condicoes?.includes('diabetes')).length;
  const gestantes = allMembers.filter(m => m.gestante === true).length;
  const criancas = allMembers.filter(m => {
    if (!m.dataNascimento) return false;
    const age = calculateAge(m.dataNascimento);
    return age !== null && age >= 0 && age <= 12;
  }).length;

  // Current month visits
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const visitsThisMonth = allVisits.filter(v => {
    if (!v.dataVisita) return false;
    const parts = v.dataVisita.split('/');
    if (parts.length !== 3) return false;
    return parseInt(parts[1]) - 1 === currentMonth && parseInt(parts[2]) === currentYear;
  }).length;

  // ACS productivity
  const acsStats = acsUsers.map(acs => {
    const acsFamilies = allFamilies.filter(f => f.acsUid === acs.id).length;
    const acsVisits = allVisits.filter(v => v.acsUid === acs.id).length;
    const acsVisitsMonth = allVisits.filter(v => {
      if (v.acsUid !== acs.id || !v.dataVisita) return false;
      const parts = v.dataVisita.split('/');
      if (parts.length !== 3) return false;
      return parseInt(parts[1]) - 1 === currentMonth && parseInt(parts[2]) === currentYear;
    }).length;
    return { ...acs, familias: acsFamilies, visitas: acsVisits, visitasMes: acsVisitsMonth };
  }).sort((a, b) => b.visitasMes - a.visitasMes);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando relatório...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Relatório da Unidade</Text>
            <Text style={styles.unitTitle}>{unitName || 'Unidade não definida'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.headerBadge}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{acsUsers.length}</Text>
            <Text style={styles.statLabel}>ACS Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalFamilies}</Text>
            <Text style={styles.statLabel}>Famílias</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalMembers}</Text>
            <Text style={styles.statLabel}>Indivíduos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{visitsThisMonth}</Text>
            <Text style={styles.statLabel}>Visitas/Mês</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEALTH INDICATORS */}
        <Text style={styles.sectionTitle}>INDICADORES DE SAÚDE</Text>
        <View style={styles.indicatorBox}>
          {[
            { icon: <FontAwesome5 name="heartbeat" size={18} color="#EF4444" />, label: 'Hipertensos', value: hipertensos, color: '#EF4444' },
            { icon: <MaterialCommunityIcons name="water" size={20} color="#F59E0B" />, label: 'Diabéticos', value: diabeticos, color: '#F59E0B' },
            { icon: <MaterialCommunityIcons name="human-pregnant" size={20} color="#EC4899" />, label: 'Gestantes', value: gestantes, color: '#EC4899' },
            { icon: <MaterialCommunityIcons name="baby-face-outline" size={20} color="#3B82F6" />, label: 'Crianças ≤ 12', value: criancas, color: '#3B82F6' },
          ].map((item, i) => (
            <View key={i}>
              <View style={styles.indicatorRow}>
                <View style={styles.indicatorIconBox}>{item.icon}</View>
                <Text style={styles.indicatorLabel}>{item.label}</Text>
                <View style={[styles.indicatorBadge, { backgroundColor: `${item.color}14` }]}>
                  <Text style={[styles.indicatorBadgeText, { color: item.color }]}>{item.value}</Text>
                </View>
              </View>
              {i < 3 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ACS PRODUCTIVITY */}
        <Text style={styles.sectionTitle}>PRODUTIVIDADE POR ACS</Text>
        {acsStats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={40} color={COLORS.grey} />
            <Text style={styles.emptyText}>Nenhum ACS vinculado a esta unidade</Text>
          </View>
        ) : (
          <View style={styles.acsBox}>
            {/* Header */}
            <View style={styles.acsTableHeader}>
              <Text style={[styles.acsTableHeaderText, { flex: 2 }]}>Agente</Text>
              <Text style={[styles.acsTableHeaderText, { flex: 1, textAlign: 'center' }]}>Famílias</Text>
              <Text style={[styles.acsTableHeaderText, { flex: 1, textAlign: 'center' }]}>Visitas/Mês</Text>
              <Text style={[styles.acsTableHeaderText, { flex: 1, textAlign: 'center' }]}>Total</Text>
            </View>

            {acsStats.map((acs, i) => (
              <View key={acs.id}>
                <View style={styles.acsRow}>
                  <View style={[styles.acsRank, {
                    backgroundColor: i === 0 ? '#F59E0B' : i === 1 ? '#94A3B8' : i === 2 ? '#CD7F32' : COLORS.primary
                  }]}>
                    <Text style={styles.acsRankText}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.acsName, { flex: 2 }]} numberOfLines={1}>{acs.nome}</Text>
                  <Text style={[styles.acsValue, { flex: 1, textAlign: 'center' }]}>{acs.familias}</Text>
                  <Text style={[styles.acsValue, { flex: 1, textAlign: 'center' }]}>{acs.visitasMes}</Text>
                  <Text style={[styles.acsValue, { flex: 1, textAlign: 'center' }]}>{acs.visitas}</Text>
                </View>
                {i < acsStats.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}

        {/* VISIT BAR CHART */}
        {acsStats.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>VISITAS NO MÊS POR ACS</Text>
            <View style={styles.chartBox}>
              {acsStats.map((acs, i) => {
                const maxVisits = Math.max(...acsStats.map(a => a.visitasMes), 1);
                const barWidth = (acs.visitasMes / maxVisits) * 100;
                return (
                  <View key={acs.id} style={styles.barRow}>
                    <Text style={styles.barLabel} numberOfLines={1}>{acs.nome?.split(' ')[0]}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${Math.max(barWidth, 2)}%` }]} />
                    </View>
                    <Text style={styles.barValue}>{acs.visitasMes}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8' },
  loadingText: { color: COLORS.grey, marginTop: 12, fontSize: 14 },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 32,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  unitTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 2 },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: { color: '#fff', fontSize: 20, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600', marginTop: 4, textAlign: 'center' },

  // Content
  scrollContent: { padding: 16, paddingBottom: 30 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.greyDark,
    marginBottom: 10,
    marginLeft: 4,
    marginTop: 8,
    letterSpacing: 0.8,
  },

  // Indicators
  indicatorBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 18,
    elevation: 2,
    marginBottom: 8,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  indicatorIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indicatorLabel: { flex: 1, fontSize: 14, color: '#1A202C', fontWeight: '500' },
  indicatorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 36,
    alignItems: 'center',
  },
  indicatorBadgeText: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },

  // ACS Table
  acsBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginBottom: 8,
  },
  acsTableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  acsTableHeaderText: { fontSize: 11, fontWeight: '700', color: COLORS.greyDark, letterSpacing: 0.3 },
  acsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  acsRank: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  acsRankText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  acsName: { fontSize: 14, fontWeight: '600', color: '#1A202C' },
  acsValue: { fontSize: 14, color: COLORS.greyDark, fontWeight: '500' },

  // Bar Chart
  chartBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    marginBottom: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: { width: 60, fontSize: 13, color: COLORS.greyDark, fontWeight: '500' },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  barValue: { width: 30, fontSize: 14, fontWeight: '700', color: COLORS.primary, textAlign: 'right' },

  // Empty
  emptyContainer: { alignItems: 'center', marginTop: 30 },
  emptyText: { fontSize: 14, color: COLORS.grey, marginTop: 12 },
});
