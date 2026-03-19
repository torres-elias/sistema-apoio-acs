import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import * as visitController from '../../controllers/visitsController';
import styles from './style';
import COLORS from "../../constants/colors";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitsThisMonth, setVisitsThisMonth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    setLoading(true);
    try {
      const data = await familyController.getFamilies(user.uid);
      setFamilies(data);
 
      const allVisits = await visitController.getVisitsByAcs(user.uid);
      const now = new Date();
      const count = allVisits.filter(v => {
        if (!v.dataVisita) return false;
        const [dd, mm, yyyy] = v.dataVisita.split('/');
        return (
          parseInt(mm) === now.getMonth() + 1 &&
          parseInt(yyyy) === now.getFullYear()
        );
      }).length;
      setVisitsThisMonth(count);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível deslogar.');
    }
  }

  // Calculate stats from families data
  const totalFamilies = families.length;
  const totalMembers = families.reduce((acc, f) => acc + 1 + (f.membros?.length || 0), 0);
  const allMembers = families.flatMap(f => f.membros || []);
  const hipertensos = allMembers.filter(m => m.condicoes?.includes('hipertensao')).length;
  const diabeticos = allMembers.filter(m => m.condicoes?.includes('diabetes')).length;
  const gestantes = allMembers.filter(m => m.gestante === true).length;
  const criancas = allMembers.filter(m => {
    if (!m.dataNascimento) return false;
    const parts = m.dataNascimento.split('/');
    if (parts.length !== 3) return false;
    const birth = new Date(parts[2], parts[1] - 1, parts[0]);
    const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= 0 && age <= 12;
  }).length;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Olá</Text>
            <Text style={styles.userName}>{user?.displayName || user?.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalFamilies}</Text>
            <Text style={styles.statLabel}>Famílias</Text>
            <Text style={styles.statSub}>cadastradas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalMembers}</Text>
            <Text style={styles.statLabel}>Indivíduos</Text>
            <Text style={styles.statSub}>vinculados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{visitsThisMonth}</Text>
            <Text style={styles.statLabel}>Visitas/Mês</Text>
            <Text style={styles.statSub}>Março 2026</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* QUICK ACCESS */}
          <Text style={styles.sectionTitle}>ACESSOS RÁPIDOS</Text>
          <View style={styles.quickAccessRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('Familias')}
            >
              <View style={styles.quickIconBox}>
                <FontAwesome5 name="home" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.quickCardTitle}>Famílias</Text>
              <Text style={styles.quickCardSub}>{totalFamilies} cadastradas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('Visitas')}
            >
              <View style={styles.quickIconBox}>
                <FontAwesome5 name="calendar-alt" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.quickCardTitle}>Visitas</Text>
              <Text style={styles.quickCardSub}>{visitsThisMonth} este mês</Text>
            </TouchableOpacity>
          </View>

          {/* FAMILIES PROFILE */}
          <Text style={styles.sectionTitle}>PERFIL DAS FAMÍLIAS</Text>
          <View style={styles.profileBox}>
            <View style={styles.profileRow}>
              <View style={styles.profileIconBox}>
                <FontAwesome5 name="heartbeat" size={18} color="#EF4444" />
              </View>
              <Text style={styles.profileLabel}>Hipertensos</Text>
              <View style={[styles.profileBadge, { backgroundColor: '#EF444414' }]}>
                <Text style={[styles.profileBadgeText, { color: '#EF4444' }]}>{hipertensos}</Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileRow}>
              <View style={styles.profileIconBox}>
                <MaterialCommunityIcons name="water" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.profileLabel}>Diabéticos</Text>
              <View style={[styles.profileBadge, { backgroundColor: '#F59E0B14' }]}>
                <Text style={[styles.profileBadgeText, { color: '#F59E0B' }]}>{diabeticos}</Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileRow}>
              <View style={styles.profileIconBox}>
                <MaterialCommunityIcons name="human-pregnant" size={20} color="#EC4899" />
              </View>
              <Text style={styles.profileLabel}>Gestantes</Text>
              <View style={[styles.profileBadge, { backgroundColor: '#EC489914' }]}>
                <Text style={[styles.profileBadgeText, { color: '#EC4899' }]}>{gestantes}</Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileRow}>
              <View style={styles.profileIconBox}>
                <MaterialCommunityIcons name="baby-face-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.profileLabel}>Crianças ≤ 12 anos</Text>
              <View style={[styles.profileBadge, { backgroundColor: '#3B82F614' }]}>
                <Text style={[styles.profileBadgeText, { color: '#3B82F6' }]}>{criancas}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}