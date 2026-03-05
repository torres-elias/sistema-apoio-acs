import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, ActivityIndicator, Alert, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { login } from '../services/authService';
import { translateError } from '../utils/errorTranslator';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Alerta', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigation.replace('HomeScreen');
    } catch (error) {
      console.log(error);
      console.log(error.code);
      Alert.alert('Erro no login', translateError(error.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={['#0D47A1', '#1565C0', '#42A5F5']}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* logo and title */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/family.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Bem-vindo(a)</Text>
          </View>

          {/* login card */}
          <View style={styles.card}>
            {/* email field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/avatar.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#A0AEC0"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* password field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../assets/padlock.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A0AEC0"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? (
                    <Image
                      source={require('../../assets/visible.png')}
                      style={styles.inputIcon}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/notvisible.png')}
                      style={styles.inputIcon}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* login button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* version */}
          <Text style={styles.version}>Sistema de Apoio ao ACS • v0.1.0</Text>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginTop: -20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#1A202C',
  },
  loginButton: {
    backgroundColor: '#1565C0',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  version: {
    color: '#F1F5F9',
    fontSize: 12,
    marginTop: 32,
  },
});