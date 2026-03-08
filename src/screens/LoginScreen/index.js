import { useState } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform, ActivityIndicator, Alert, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { translateError } from '../../utils/errorTranslator';
import styles from './style';
import COLORS from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
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
      await signIn(email.trim().toLowerCase(), password);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro no login', error.message || translateError(error.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
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
              source={require('../../../assets/family.png')}
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
                  source={require('../../../assets/avatar.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={COLORS.grey}
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
                  source={require('../../../assets/padlock.png')}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.grey}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? (
                    <Image
                      source={require('../../../assets/visible.png')}
                      style={styles.inputIcon}
                    />
                  ) : (
                    <Image
                      source={require('../../../assets/notvisible.png')}
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
                <ActivityIndicator color={COLORS.white} />
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

