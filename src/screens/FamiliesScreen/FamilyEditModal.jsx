import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as familyController from '../../controllers/familyController';
import styles from './style';
import COLORS from '../../constants/colors';
import { TIPOS_MORADIA } from '../../constants/appConstants';

const FORM_INICIAL = {
  responsavel: '',
  cep:         '',
  logradouro:  '',
  numero:      '',
  bairro:      '',
  tipoMoradia: 'Casa',
};

export default function FamilyEditModal({ visible, editingFamily, onClose, onSaved }) {
  const [form, setForm]           = useState(FORM_INICIAL);
  const [saving, setSaving]       = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    if (visible && editingFamily) {
      setForm({
        responsavel: editingFamily.responsavel || '',
        cep:         editingFamily.cep         || '',
        logradouro:  editingFamily.logradouro  || '',
        numero:      editingFamily.numero      || '',
        bairro:      editingFamily.bairro      || '',
        tipoMoradia: editingFamily.tipoMoradia || 'Casa',
      });
    }
  }, [visible, editingFamily]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
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
    setSaving(true);
    try {
      await familyController.updateFamily(editingFamily.id, form);
      onSaved();
      Alert.alert('Sucesso', 'Família atualizada.');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Editar Família</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Responsável */}
          <Text style={styles.formLabel}>RESPONSÁVEL FAMILIAR *</Text>
          <TextInput
            style={styles.formInput}
            value={form.responsavel}
            onChangeText={v => setField('responsavel', v)}
            placeholder="Ex: João Silva"
            placeholderTextColor={COLORS.grey}
          />

          {/* CEP e Número */}
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

          {/* Logradouro */}
          <Text style={styles.formLabel}>LOGRADOURO *</Text>
          <TextInput
            style={[styles.formInput, loadingCep && styles.formInputDisabled]}
            value={form.logradouro}
            onChangeText={v => setField('logradouro', v)}
            editable={!loadingCep}
            placeholderTextColor={COLORS.grey}
          />

          {/* Bairro */}
          <Text style={styles.formLabel}>BAIRRO *</Text>
          <TextInput
            style={[styles.formInput, loadingCep && styles.formInputDisabled]}
            value={form.bairro}
            onChangeText={v => setField('bairro', v)}
            editable={!loadingCep}
            placeholderTextColor={COLORS.grey}
          />

          {/* Tipo de moradia */}
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

          {/* Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={COLORS.surface} />
              : <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
