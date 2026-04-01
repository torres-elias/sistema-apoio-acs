import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { handleAddUser } from '../../controllers/userController';
import COLORS from '../../constants/colors';

export default function UserFormScreen() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: 'ACS'
  });

  const saveUser = async () => {
    setLoading(true);
    try {
      const msg = await handleAddUser(form);
      Alert.alert("Sucesso", msg);
      setForm({ nome: '', email: '', password: '', confirmPassword: '', cargo: 'ACS' });
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>NOME DO AGENTE</Text>
          <TextInput 
            style={styles.input}
            placeholder="Nome Completo"
            value={form.nome}
            onChangeText={(v) => setForm({...form, nome: v})}
          />

          <Text style={styles.label}>E-MAIL ACESSO</Text>
          <TextInput 
            style={styles.input}
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({...form, email: v})}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>SENHA</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••"
                secureTextEntry
                value={form.password}
                onChangeText={(v) => setForm({...form, password: v})}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>CONFIRMAR</Text>
              <TextInput 
                style={styles.input}
                placeholder="••••••"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => setForm({...form, confirmPassword: v})}
              />
            </View>
          </View>

          <Text style={styles.label}>CARGO / PERMISSÃO</Text>
          <View style={styles.cargoContainer}>
            {['ACS', 'ADM'].map((role) => (
              <TouchableOpacity 
                key={role}
                style={[styles.cargoOption, form.cargo === role && styles.cargoSelected]}
                onPress={() => setForm({...form, cargo: role})}
              >
                <Text style={[styles.cargoText, form.cargo === role && styles.cargoTextSelected]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={saveUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>CADASTRAR AGENTE</Text>
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
  label: { fontSize: 12, fontWeight: '700', color: COLORS.greyDark, marginBottom: 8, letterSpacing: 0.5 },
  input: { 
    backgroundColor: COLORS.white, 
    borderWidth: 1.5, 
    borderColor: COLORS.border, 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 20,
    fontSize: 15
  },
  row: { flexDirection: 'row' },
  cargoContainer: { flexDirection: 'row', marginBottom: 30 },
  cargoOption: { 
    flex: 1, 
    padding: 12, 
    borderWidth: 1.5, 
    borderColor: COLORS.border, 
    alignItems: 'center',
    borderRadius: 12,
    marginRight: 8
  },
  cargoSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  cargoText: { fontWeight: 'bold', color: COLORS.greyDark },
  cargoTextSelected: { color: COLORS.white },
  button: { 
    backgroundColor: COLORS.primary, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});