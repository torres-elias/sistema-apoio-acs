import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as familyController from '../../controllers/familyController';
import styles from './style';
import COLORS from '../../constants/colors';

//Constante estática fora do componente
const TIPOS_MORADIA = [
  'Casa', 'Prédio', 'Estúdio', 'Kitnet', 'Apartamento',
  'Condomínio', 'Chácara', 'Sítio', 'Fazenda', 'República', 'Casa de Pensão',
];

const FORM_INICIAL = {
  responsavel: '',
  cep:         '',
  logradouro:  '',
  numero:      '',
  bairro:      '',
  tipoMoradia: 'Casa',
};

export default function FamilyFormScreen({ route, navigation }) {
  const { user } = useAuth();
  const familyId = route.params?.familyId || null;
  const isEditing = !!familyId;

  //Estado da tela
  const [form, setForm]               = useState(FORM_INICIAL);
  const [loading, setLoading]         = useState(false);
  const [loadingCep, setLoadingCep]   = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (isEditing) loadFamily();
  }, []);

  async function loadFamily() {
    setLoadingData(true);
    try {
      const families = await familyController.getFamilies(user.uid);
      const found    = families.find(f => f.id === familyId);
      if (found) {
        setForm({
          responsavel: found.responsavel,
          cep:         found.cep,
          logradouro:  found.logradouro,
          numero:      found.numero,
          bairro:      found.bairro,
          tipoMoradia: found.tipoMoradia,
        });
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

  async function handleCepChange(value) {
    const clean = value.replace(/\D/g, '');
    setField('cep', clean);

    if (clean.length === 8) {
      setLoadingCep(true);
      try {
        const res  = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (data.erro) {
          Alert.alert('Erro', 'CEP não encontrado.');
        } else {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro:     data.bairro     || '',
          }));
        }
      } catch {
        Alert.alert('Erro', 'Falha ao conectar ao serviço de CEP.');
      } finally {
        setLoadingCep(false);
      }
    }
  }

  async function handleSave() {
    const { responsavel, logradouro, numero, bairro, cep } = form;
    if (!responsavel || !logradouro || !numero || !bairro || cep.length < 8) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (*).');
      return;
    }
    setLoading(true);
    try {
      if (isEditing) {
        await familyController.updateFamily(familyId, form);
        Alert.alert('Sucesso', 'Família atualizada.');
      } else {
        await familyController.createFamily(form, user.uid);
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

      {/* FORMULÁRIO */}
      <ScrollView
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.formLabel}>RESPONSÁVEL FAMILIAR *</Text>
        <TextInput
          style={styles.formInput}
          value={form.responsavel}
          onChangeText={v => setField('responsavel', v)}
          placeholder="Ex: João Silva"
          placeholderTextColor={COLORS.grey}
        />

        <View style={styles.formRow}>
          <View style={{ flex: 3, marginRight: 12 }}>
            <Text style={styles.formLabel}>CEP *</Text>
            <View style={styles.formInputRow}>
              <TextInput
                style={[styles.formInput, { flex: 1, marginBottom: 0 }]}
                value={form.cep}
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
              value={form.numero}
              onChangeText={v => setField('numero', v)}
              keyboardType="numeric"
              placeholderTextColor={COLORS.grey}
            />
          </View>
        </View>

        <Text style={styles.formLabel}>LOGRADOURO *</Text>
        <TextInput
          style={[styles.formInput, loadingCep && styles.formInputDisabled]}
          value={form.logradouro}
          onChangeText={v => setField('logradouro', v)}
          editable={!loadingCep}
          placeholderTextColor={COLORS.grey}
        />

        <Text style={styles.formLabel}>BAIRRO *</Text>
        <TextInput
          style={[styles.formInput, loadingCep && styles.formInputDisabled]}
          value={form.bairro}
          onChangeText={v => setField('bairro', v)}
          editable={!loadingCep}
          placeholderTextColor={COLORS.grey}
        />

        <Text style={styles.formLabel}>TIPO DE MORADIA</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tipoScroll}
        >
          {TIPOS_MORADIA.map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[styles.tipoBtn, form.tipoMoradia === tipo && styles.tipoBtnActive]}
              onPress={() => setField('tipoMoradia', tipo)}
            >
              <Text style={[
                styles.tipoBtnText,
                form.tipoMoradia === tipo && styles.tipoBtnTextActive,
              ]}>
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>
                {isEditing ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR FAMÍLIA'}
              </Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
