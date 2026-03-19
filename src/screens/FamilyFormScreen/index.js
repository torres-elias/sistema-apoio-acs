import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import styles from './style';
import COLORS from '../../constants/colors';

export default function FamilyFormScreen({ route, navigation }) {
  const { user } = useAuth();
  const familyId = route.params?.familyId || null;
  const isEditing = !!familyId;

  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  // Form states
  const [responsavel, setResponsavel] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [tipoMoradia, setTipoMoradia] = useState('Casa');

  const tiposMoradia = [
    'Casa', 'Prédio', 'Estúdio', 'Kitnet', 'Apartamento',
    'Condomínio', 'Chácara', 'Sítio', 'Fazenda', 'República', 'Casa de Pensão'
  ];

  // Load existing data if editing
  useEffect(() => {
    if (isEditing) {
      loadFamily();
    }
  }, []);

  async function loadFamily() {
    setLoadingData(true);
    try {
      const families = await familyController.getFamilies(user.uid);
      const found = families.find(f => f.id === familyId);
      if (found) {
        setResponsavel(found.responsavel);
        setCep(found.cep);
        setLogradouro(found.logradouro);
        setNumero(found.numero);
        setBairro(found.bairro);
        setTipoMoradia(found.tipoMoradia);
      } else {
        Alert.alert('Erro', 'Família não encontrada.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoadingData(false);
    }
  }

  // CEP auto-fill
  async function handleCepChange(value) {
    const cleanedCep = value.replace(/\D/g, '');
    setCep(cleanedCep);

    if (cleanedCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          Alert.alert("Erro", "CEP não encontrado.");
        } else {
          setLogradouro(data.logradouro || '');
          setBairro(data.bairro || '');
        }
      } catch (error) {
        Alert.alert("Erro", "Falha ao conectar ao serviço de CEP.");
      } finally {
        setLoadingCep(false);
      }
    }
  }

  async function handleSave() {
    if (!responsavel || !logradouro || !numero || !bairro || cep.length < 8) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios (*).");
      return;
    }

    const familyData = {
      responsavel,
      cep,
      logradouro,
      numero,
      bairro,
      tipoMoradia,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await familyController.updateFamily(familyId, familyData);
        Alert.alert('Sucesso', 'Família atualizada.');
      } else {
        await familyController.createFamily(familyData, user.uid);
        Alert.alert('Sucesso', 'Família cadastrada.');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Família' : 'Nova Família'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FORM */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formLabel}>RESPONSÁVEL FAMILIAR *</Text>
        <TextInput
          style={styles.formInput}
          value={responsavel}
          onChangeText={setResponsavel}
          placeholder="Ex: João Silva"
          placeholderTextColor={COLORS.grey}
        />

        <View style={styles.formRow}>
          <View style={{ flex: 3, marginRight: 12 }}>
            <Text style={styles.formLabel}>CEP *</Text>
            <View style={styles.formInputRow}>
              <TextInput
                style={[styles.formInput, { flex: 1, marginBottom: 0 }]}
                value={cep}
                onChangeText={handleCepChange}
                keyboardType="numeric"
                maxLength={8}
                placeholder="Somente números"
                placeholderTextColor={COLORS.grey}
              />
              {loadingCep && (
                <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 8 }} />
              )}
            </View>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.formLabel}>NÚMERO *</Text>
            <TextInput
              style={styles.formInput}
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              placeholderTextColor={COLORS.grey}
            />
          </View>
        </View>

        <Text style={styles.formLabel}>LOGRADOURO *</Text>
        <TextInput
          style={[styles.formInput, loadingCep && styles.formInputDisabled]}
          value={logradouro}
          onChangeText={setLogradouro}
          editable={!loadingCep}
          placeholderTextColor={COLORS.grey}
        />

        <Text style={styles.formLabel}>BAIRRO *</Text>
        <TextInput
          style={[styles.formInput, loadingCep && styles.formInputDisabled]}
          value={bairro}
          onChangeText={setBairro}
          editable={!loadingCep}
          placeholderTextColor={COLORS.grey}
        />

        <Text style={styles.formLabel}>TIPO DE MORADIA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipoScroll}>
          {tiposMoradia.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[styles.tipoBtn, tipoMoradia === tipo && styles.tipoBtnActive]}
              onPress={() => setTipoMoradia(tipo)}
            >
              <Text style={[styles.tipoBtnText, tipoMoradia === tipo && styles.tipoBtnTextActive]}>
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FAMÍLIA'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}