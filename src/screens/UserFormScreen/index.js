import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { handleAddUser } from '../../controllers/userController';
import * as unitController from '../../controllers/unitController';
import COLORS from '../../constants/colors';

export default function UserFormScreen() {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: 'ACS',
    unidadeId: '',
  });

  useEffect(() => {
    loadUnits();
  }, []);

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

  const saveUser = async () => {
    if (!form.unidadeId) {
      Alert.alert('Atenção', 'Selecione uma unidade de saúde.');
      return;
    }

    setLoading(true);
    try {
      const msg = await handleAddUser(form);
      Alert.alert("Sucesso", msg);
      setForm({ nome: '', email: '', password: '', confirmPassword: '', cargo: 'ACS', unidadeId: '' });
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedUnit = units.find(u => u.id === form.unidadeId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>NOME COMPLETO</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor={COLORS.grey}
            value={form.nome}
            onChangeText={(v) => setForm({ ...form, nome: v })}
          />

          <Text style={styles.label}>E-MAIL DE ACESSO</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            placeholderTextColor={COLORS.grey}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>SENHA</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={COLORS.grey}
                secureTextEntry
                value={form.password}
                onChangeText={(v) => setForm({ ...form, password: v })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CONFIRMAR</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={COLORS.grey}
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
              />
            </View>
          </View>

          <Text style={styles.label}>CARGO / PERMISSÃO</Text>
          <View style={styles.cargoContainer}>
            {['ACS', 'GERENTE', 'ADM'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.cargoOption, form.cargo === role && styles.cargoSelected]}
                onPress={() => setForm({ ...form, cargo: role })}
              >
                <Text style={[styles.cargoText, form.cargo === role && styles.cargoTextSelected]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>UNIDADE DE SAÚDE</Text>
          {loadingUnits ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginBottom: 20 }} />
          ) : units.length === 0 ? (
            <View style={styles.emptyUnits}>
              <Ionicons name="alert-circle-outline" size={20} color={COLORS.warning} />
              <Text style={styles.emptyUnitsText}>
                Nenhuma unidade cadastrada. Cadastre uma unidade primeiro no painel admin.
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitsScroll}>
              {units.map(unit => (
                <TouchableOpacity
                  key={unit.id}
                  style={[styles.unitBtn, form.unidadeId === unit.id && styles.unitBtnActive]}
                  onPress={() => setForm({ ...form, unidadeId: unit.id })}
                >
                  <Ionicons
                    name="business"
                    size={16}
                    color={form.unidadeId === unit.id ? '#fff' : COLORS.primary}
                  />
                  <Text style={[styles.unitBtnText, form.unidadeId === unit.id && styles.unitBtnTextActive]}>
                    {unit.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={saveUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>CADASTRAR USUÁRIO</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, elevation: 4 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.greyDark, marginBottom: 8, letterSpacing: 0.5, marginTop: 4 },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border || '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
    color: COLORS.text,
  },
  row: { flexDirection: 'row' },
  cargoContainer: { flexDirection: 'row', marginBottom: 20, gap: 8 },
  cargoOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border || '#E2E8F0',
    alignItems: 'center',
    borderRadius: 12,
  },
  cargoSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  cargoText: { fontWeight: 'bold', color: COLORS.greyDark },
  cargoTextSelected: { color: COLORS.white },
  unitsScroll: { marginBottom: 20 },
  unitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  unitBtnActive: { backgroundColor: COLORS.primary },
  unitBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },
  unitBtnTextActive: { color: '#fff' },
  emptyUnits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  emptyUnitsText: { flex: 1, fontSize: 13, color: '#92400E' },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});
