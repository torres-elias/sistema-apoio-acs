import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as visitController from '../../controllers/visitsController';
import styles from './style';
import COLORS from '../../constants/colors';

const TIPOS_DE_VISITA = [
  { key: 'Rotina',      label: 'Rotina',      icon: 'calendar-outline', color: COLORS.primary },
  { key: 'Busca Ativa', label: 'Busca Ativa', icon: 'search',           color: '#7C3AED'      },
  { key: 'Urgência',    label: 'Urgência',    icon: 'alert-circle',     color: '#DC2626'      },
];

function formatDateInput(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
}

function todayString() {
  const today = new Date();
  const dd    = String(today.getDate()).padStart(2, '0');
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy  = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function VisitFormModal({
  visible, familyId, familyName, members, userId, onClose, onSaved,
}) {
  const [form, setForm] = useState({
    tipo:    'Rotina',
    membro:  'Família',
    motivo:  '',
    data:    '',
    pressao: '',
    glicemia:'',
    obs:     '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setForm({
        tipo:    'Rotina',
        membro:  'Família',
        motivo:  '',
        data:    todayString(),
        pressao: '',
        glicemia:'',
        obs:     '',
      });
    }
  }, [visible]);

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const membroOptions = ['Família', ...(members || []).map(m => m.nome)];

  async function handleSave() {
    if (!form.motivo.trim()) {
      Alert.alert('Atenção', 'Informe o motivo da visita.');
      return;
    }
    setSaving(true);
    try {
      await visitController.createVisit(
        {
          familyId,
          familyName,
          paciente:    form.membro,
          tipoVisita:  form.tipo,
          motivo:      form.motivo.trim(),
          pressao:     form.pressao.trim(),
          glicemia:    form.glicemia.trim(),
          observacoes: form.obs.trim(),
          dataVisita:  form.data,
        },
        userId
      );
      onSaved();
      Alert.alert('Sucesso', 'Visita registrada com sucesso!');
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
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.modalHeaderTitle}>Nova Visita</Text>
            <Text style={styles.modalHeaderSubtitle} numberOfLines={1}>
              {familyName}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.formContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tipo de visita */}
          <Text style={styles.formLabel}>TIPO DE VISITA</Text>
          <View style={styles.visitTipoRow}>
            {TIPOS_DE_VISITA.map(tipo => {
              const active = form.tipo === tipo.key;
              return (
                <TouchableOpacity
                  key={tipo.key}
                  style={[
                    styles.visitTipoBtn,
                    active && { backgroundColor: tipo.color, borderColor: tipo.color },
                  ]}
                  onPress={() => setField('tipo', tipo.key)}
                >
                  <Ionicons name={tipo.icon} size={14} color={active ? '#fff' : tipo.color} />
                  <Text style={[styles.visitTipoBtnText, active && { color: '#fff' }]}>
                    {tipo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Membro visitado */}
          <Text style={styles.formLabel}>MEMBRO VISITADO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.visitMembroRow}>
              {membroOptions.map((nome, idx) => {
                const active = form.membro === nome;
                return (
                  <TouchableOpacity
                    key={`membro-${idx}`}
                    style={[styles.visitMembroChip, active && styles.visitMembroChipActive]}
                    onPress={() => setField('membro', nome)}
                  >
                    <Ionicons
                      name={nome === 'Família' ? 'people' : 'person'}
                      size={13}
                      color={active ? '#fff' : COLORS.primary}
                    />
                    <Text style={[styles.visitMembroChipText, active && { color: '#fff' }]}>
                      {nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Motivo */}
          <Text style={styles.formLabel}>MOTIVO *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Ex: Acompanhamento mensal"
            placeholderTextColor={COLORS.grey}
            value={form.motivo}
            onChangeText={v => setField('motivo', v)}
            multiline
          />

          {/* Data */}
          <Text style={styles.formLabel}>DATA DA VISITA</Text>
          <TextInput
            style={styles.formInput}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={COLORS.grey}
            value={form.data}
            onChangeText={v => setField('data', formatDateInput(v))}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Sinais vitais */}
          <Text style={styles.formLabel}>SINAIS VITAIS (opcional)</Text>
          <View style={styles.visitVitaisRow}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.formInput}
                placeholder="Pressão (ex: 120/80)"
                placeholderTextColor={COLORS.grey}
                value={form.pressao}
                onChangeText={v => setField('pressao', v)}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 10 }} />
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.formInput}
                placeholder="Glicemia (mg/dL)"
                placeholderTextColor={COLORS.grey}
                value={form.glicemia}
                onChangeText={v => setField('glicemia', v)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Observações */}
          <Text style={styles.formLabel}>OBSERVAÇÕES</Text>
          <TextInput
            style={[styles.formInput, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Anotações adicionais sobre a visita..."
            placeholderTextColor={COLORS.grey}
            value={form.obs}
            onChangeText={v => setField('obs', v)}
            multiline
            numberOfLines={4}
          />

          {/* Salvar */}
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>SALVAR VISITA</Text>
                </>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
