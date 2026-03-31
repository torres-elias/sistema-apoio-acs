import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../constants/colors';

export default function AdminScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Gerenciamento de Equipe</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserForm')}
        >
          <View style={[styles.iconContainer, { backgroundColor: COLORS.success }]}>
            <Ionicons name="person-add" size={24} color={COLORS.white} />
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>Novo Agente</Text>
            <Text style={styles.menuSubtitle}>Cadastrar novo ACS no sistema</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
        </TouchableOpacity>

        {/* Espaço para futuras funções como Relatórios ou Logs */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.greyDark, marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 16 },
  menuTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  menuSubtitle: { fontSize: 13, color: COLORS.greyDark, marginTop: 2 },
});